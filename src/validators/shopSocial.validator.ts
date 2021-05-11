import { CreateShopSocialInfoDto } from '../dto/shopSocial.dto';
import shopSocialValidationRegex from './validationRegex/shopSocial.validationRegex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class ShopSocialValidator extends Validator {
  public data: CreateShopSocialInfoDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = shopSocialValidationRegex;

  constructor(
    shopSocialDto: CreateShopSocialInfoDto,
    updating: boolean = false,
  ) {
    super();
    this.updating = updating;
    this.data = shopSocialDto;
  }

  public validate(): Validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
