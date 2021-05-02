import { ShopEmail } from '../entities/ShopEmail.entity';
import shopEmailValidationRegex from './validationRegex/shopEmail.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class ShopEmailValidator extends Validator {
  public data: ShopEmail;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = shopEmailValidationRegex;

  constructor(shopEmail: ShopEmail) {
    super();
    this.data = shopEmail;
  }

  public validate(): validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
