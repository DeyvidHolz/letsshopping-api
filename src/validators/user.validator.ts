import validator from 'validator';
import { User } from '../entities/User.entity';
import userValidationRegex from './validationRegex/user.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class UserValidator extends Validator {
  public data: User;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = userValidationRegex;

  constructor(user: User, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = user;
  }

  public validate(): validation {
    super.validate();

    if (!validator.isEmail(this.data.email))
      this.addError('email', 'Invalid email.');

    if (!validator.isDate(this.data.birthDate)) {
      this.addError(
        'email',
        'Invalid birth date. The date format should be YYYY-MM-DD.',
      );
    }

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
