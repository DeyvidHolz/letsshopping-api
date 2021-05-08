import validator from 'validator';
import { Order } from '../entities/Order.entity';
import orderValidationRegex from './validationRegex/order.validationRegex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class OrderValidator extends Validator {
  public data: Order;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = orderValidationRegex;

  constructor(order: Order, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = order;
  }

  public validate(): Validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
