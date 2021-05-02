import { ShopSocial } from '../entities/ShopSocial.entity';
import shopSocialValidationRegex from './validationRegex/shopSocial.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class ShopSocialValidator extends Validator {
  public data: ShopSocial;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = shopSocialValidationRegex;

  constructor(shopSocial: ShopSocial, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = shopSocial;
  }

  public validate(): validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
