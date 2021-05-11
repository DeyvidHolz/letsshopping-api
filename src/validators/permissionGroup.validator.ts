import {
  CreatePermissionGroupDto,
  UpdatePermissionGroupDto,
} from '../dto/permissionGroup.dto';
import permissionGroupValidationRegex from './validationRegex/permissionGroup.validationRegex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class PermissionGroupValidator extends Validator {
  public data: CreatePermissionGroupDto | UpdatePermissionGroupDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = permissionGroupValidationRegex;

  constructor(
    permissionGroupDto: CreatePermissionGroupDto | UpdatePermissionGroupDto,
    updating: boolean = false,
  ) {
    super();
    this.updating = updating;
    this.data = permissionGroupDto;
  }

  public validate(): Validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
