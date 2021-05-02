import validator from 'validator';
import countryList from '../config/countryList.config';
import { Address } from '../entities/Address.entity';
import addressValidationRegex from './validationRegex/address.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class AddressValidator extends Validator {
  public data: Address;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = addressValidationRegex;

  constructor(address: Address, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = address;
  }

  public validate(): validation {
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
