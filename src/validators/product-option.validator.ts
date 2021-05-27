import { CreateProductOptionDto } from '../dto/product-option.dto';
import ProductOptionValueValidator from './product-option-value.validator';
import productOptionValidationRegex from './validationRegex/product-option.validation-regex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class ProductOptionValidator extends Validator {
  public data: CreateProductOptionDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = productOptionValidationRegex;

  constructor(
    productOptionDto: CreateProductOptionDto,
    updating: boolean = false,
  ) {
    super();
    this.updating = updating;
    this.data = productOptionDto;
  }

  public validate(): Validation {
    super.validate();

    // Implementing ProductOptionValue validations
    if (this.data.values && this.data.values.length) {
      this.data.values.forEach((optionValue) => {
        const optionValueValidation = new ProductOptionValueValidator(
          optionValue,
        );
        if (optionValueValidation.hasErrors()) {
          this.addError('values', optionValueValidation.first());
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
