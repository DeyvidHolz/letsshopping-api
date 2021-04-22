import { Product } from '../entities/Product.entity';
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

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
