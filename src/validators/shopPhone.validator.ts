import { ShopPhone } from '../entities/ShopPhone.entity';
import shopPhoneValidationRegex from './validationRegex/shopPhone.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class ShopPhoneValidator extends Validator {
  public data: ShopPhone;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = shopPhoneValidationRegex;

  constructor(shopPhone: ShopPhone, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = shopPhone;
  }

  public validate(): validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
