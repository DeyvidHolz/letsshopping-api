import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import ProductOptionValidator from './product-option.validator';
import productValidationRegex from './validationRegex/product.validation-regex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class ProductValidator extends Validator {
  public data: CreateProductDto | UpdateProductDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = productValidationRegex;

  constructor(
    productDto: CreateProductDto | UpdateProductDto,
    updating: boolean = false,
  ) {
    super();
    this.updating = updating;
    this.data = productDto;
  }

  public validate(): Validation {
    super.validate();

    // Categories from endpoint can be an array of integers (ids)
    if (this.data.categories && this.data.categories.length) {
      this.data.categories.forEach((categoryId: any, index) => {
        if (typeof categoryId === 'object') categoryId = categoryId.id;

        if (!String(categoryId).match(/[0-9]+/)) {
          this.addError(`categories[${index}]`, 'Invalid category ID.');
        }
      });
    }

    // Implementing ProductOption validations
    if (this.data.options && this.data.options.length) {
      this.data.options.forEach((option, index) => {
        const productOptionValidation = new ProductOptionValidator(option);
        if (productOptionValidation.hasErrors()) {
          this.addError(`options[${index}]`, productOptionValidation.first());
          return;
        }
      });
    }

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
