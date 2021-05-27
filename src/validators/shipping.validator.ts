import { CreateShippingDto, UpdateShippingDto } from '../dto/shipping.dto';
import shippingValidationRegex from './validationRegex/shipping.validation-regex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class ShippingValidator extends Validator {
  public data: CreateShippingDto | UpdateShippingDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = shippingValidationRegex;

  constructor(
    shippingDto: CreateShippingDto | UpdateShippingDto,
    updating: boolean = false,
  ) {
    super();
    this.updating = updating;
    this.data = shippingDto;
  }

  public validate(): Validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
