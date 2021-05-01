import validator from 'validator';
import { PermissionGroup } from '../entities/PermissionGroup.entity';
import permissionGroupValidationRegex from './validationRegex/permissionGroup.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class PermissionGroupValidator extends Validator {
  public data: PermissionGroup;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = permissionGroupValidationRegex;

  constructor(permissionGroup: PermissionGroup) {
    super();
    this.data = permissionGroup;
  }

  public validate(): validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
