import { CreateShopEmailInfoDto } from '../dto/shopEmail.dto';
import shopEmailValidationRegex from './validationRegex/shopEmail.validationRegex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class ShopEmailValidator extends Validator {
  public data: CreateShopEmailInfoDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = shopEmailValidationRegex;

  constructor(shopEmail: CreateShopEmailInfoDto, updating: boolean = false) {
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
