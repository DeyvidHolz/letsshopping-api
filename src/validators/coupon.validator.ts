import validator from 'validator';
import { CreateCouponDto, UpdateCouponDto } from '../dtos/coupon.dto';
import couponValidationRegex from './validationRegex/coupon.validation-regex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class CouponValidator extends Validator {
  public data: CreateCouponDto | UpdateCouponDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = couponValidationRegex;

  constructor(
    couponDto: CreateCouponDto | UpdateCouponDto,
    updating: boolean = false,
  ) {
    super();
    this.updating = updating;
    this.data = couponDto;
  }

  public validate(): Validation {
    super.validate();

    if (
      this.data.isActive !== undefined &&
      !validator.isBoolean(String(this.data.isActive))
    ) {
      this.addError('isActive');
    }

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
