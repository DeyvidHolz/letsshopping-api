import { CreateShopEmailInfoDto } from '../dtos/shop-email.dto';
import shopEmailValidationRegex from './validationRegex/shop-email.validation-regex';

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

  constructor(shopEmailDto: CreateShopEmailInfoDto, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = shopEmailDto;
  }

  public validate(): Validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
