import { ShopSocial } from '../entities/ShopSocial.entity';
import shopSocialValidationRegex from './validationRegex/shopSocial.validationRegex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class ShopSocialValidator extends Validator {
  public data: ShopSocial;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = shopSocialValidationRegex;

  constructor(shopSocial: ShopSocial, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = shopSocial;
  }

  public validate(): Validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
