import { CreateShopSocialInfoDto } from '../dto/shop-social.dto';
import shopSocialValidationRegex from './validationRegex/shop-social.validation-regex';

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
