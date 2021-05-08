import { CreateShopPhoneInfoDto } from '../dto/shopPhone.dto';
import shopPhoneValidationRegex from './validationRegex/shopPhone.validationRegex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class ShopPhoneValidator extends Validator {
  public data: CreateShopPhoneInfoDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = shopPhoneValidationRegex;

  constructor(shopPhone: CreateShopPhoneInfoDto, updating: boolean = false) {
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
