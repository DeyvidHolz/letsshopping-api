import validator from 'validator';
import { ShopInfo } from '../entities/ShopInfo.entity';
import shopInfoValidationRegex from './validationRegex/shopInfo.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class ShopInfoValidator extends Validator {
  public data: ShopInfo;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = shopInfoValidationRegex;

  constructor(shopInfo: ShopInfo) {
    super();
    this.data = shopInfo;
  }

  public validate(): validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
