import { ShopPhone } from '../entities/ShopPhone.entity';
import shopPhoneValidationRegex from './validationRegex/shopPhone.validationRegex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class ShopPhoneValidator extends Validator {
  public data: ShopPhone;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = shopPhoneValidationRegex;

  constructor(shopPhone: ShopPhone, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = shopPhone;
  }

  public validate(): Validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
