import validator from 'validator';
import { Coupon } from '../entities/Coupon.entity';
import couponValidationRegex from './validationRegex/coupon.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class CouponValidator extends Validator {
  public data: Coupon;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = couponValidationRegex;

  constructor(coupon: Coupon, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = coupon;
  }

  public validate(): validation {
    super.validate();

    if (!validator.isBoolean(String(this.data.isActive)))
      this.addError('isActive');

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
