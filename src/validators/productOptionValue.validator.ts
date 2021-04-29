import { ProductOptionValue } from '../entities/ProductOptionValue.entity';
import productOptionValueValidationRegex from './validationRegex/productOptionValue.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class ProductOptionValueValidator extends Validator {
  public data: ProductOptionValue;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = productOptionValueValidationRegex;

  constructor(productOptionValue: ProductOptionValue) {
    super();
    this.data = productOptionValue;
  }

  public validate(): validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
