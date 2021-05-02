import validator from 'validator';
import { Order } from '../entities/Order.entity';
import orderValidationRegex from './validationRegex/order.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class OrderValidator extends Validator {
  public data: Order;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = orderValidationRegex;

  constructor(order: Order, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = order;
  }

  public validate(): validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
