import validator from 'validator';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import userValidationRegex from './validationRegex/user.validation-regex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class UserValidator extends Validator {
  public data: CreateUserDto | UpdateUserDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = userValidationRegex;

  constructor(user: CreateUserDto | UpdateUserDto, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = user;
  }

  public validate(): Validation {
    super.validate();

    if (this.updating) {
      const data = this.data as UpdateUserDto;
      if (!data.currentPassword)
        this.addError(
          'currentPassword',
          "Field 'currentPassword' is required.",
        );
    }

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
