import validator from 'validator';
import { Shipping } from '../entities/Shipping.entity';
import shippingValidationRegex from './validationRegex/shipping.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class ShippingValidator extends Validator {
  public data: Shipping;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = shippingValidationRegex;

  constructor(shipping: Shipping) {
    super();
    this.data = shipping;
  }

  public validate(): validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
