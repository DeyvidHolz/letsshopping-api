import { ProductOption } from '../entities/ProductOption.entity';
import ProductOptionValueValidator from './productOptionValue.validator';
import productOptionValidationRegex from './validationRegex/productOption.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class ProductOptionValidator extends Validator {
  public data: ProductOption;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = productOptionValidationRegex;

  constructor(productOption: ProductOption, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = productOption;
  }

  public validate(): validation {
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
