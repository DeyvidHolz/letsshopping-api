import { ShopEmail } from '../entities/ShopEmail.entity';
import shopEmailValidationRegex from './validationRegex/shopEmail.validationRegex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class ShopEmailValidator extends Validator {
  public data: ShopEmail;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = shopEmailValidationRegex;

  constructor(shopEmail: ShopEmail, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = shopEmail;
  }

  public validate(): Validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
