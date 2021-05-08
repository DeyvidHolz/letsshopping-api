import validator from 'validator';
import countryList from '../config/countryList.config';
import addressValidationRegex from './validationRegex/address.validationRegex';
import { CreateAddressDto, UpdateAddressDto } from '../dto/address.dto';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class AddressValidator extends Validator {
  public data: CreateAddressDto | UpdateAddressDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = addressValidationRegex;

  constructor(
    address: CreateAddressDto | UpdateAddressDto,
    updating: boolean = false,
  ) {
    super();
    this.updating = updating;
    this.data = address;
  }

  public validate(): Validation {
    super.validate();

    if (!validator.isBoolean(String(this.data.isMain))) this.addError('isMain');

    const country = !countryList.find(
      (c) => c['alpha-3'].toUpperCase() === this.data.country.toUpperCase(),
    );
    if (!country) this.addError('country', 'Invalid country code.');

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
