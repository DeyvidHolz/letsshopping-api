import { Product } from '../entities/Product.entity';
import ProductOptionValidator from './productOption.validator';
import productValidationRegex from './validationRegex/product.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class ProductValidator extends Validator {
  public data: Product;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = productValidationRegex;

  constructor(product: Product) {
    super();
    this.data = product;
  }

  public validate(): validation {
    super.validate();

    // Categories from endpoint can be an array of integers (ids)
    if (this.data.categories && this.data.categories.length) {
      const invalidCategory = this.data.categories.find((category) => {
        if (
          typeof category !== 'object' ||
          String(category.id).match(/[0-9]+/)
        ) {
          return category;
        }
      });

      if (invalidCategory)
        this.addError('categories', 'One or more categories are invalid.');
    }

    // Implementing ProductOption validations
    if (this.data.options && this.data.options.length) {
      this.data.options.forEach((option) => {
        const productOptionValidation = new ProductOptionValidator(option);
        if (productOptionValidation.hasErrors()) {
          this.addError('options', productOptionValidation.first());
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
