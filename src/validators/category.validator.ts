import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import categoryValidationRegex from './validationRegex/category.validationRegex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class CategoryValidator extends Validator {
  public data: CreateCategoryDto | UpdateCategoryDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = categoryValidationRegex;

  constructor(
    category: CreateCategoryDto | UpdateCategoryDto,
    updating: boolean = false,
  ) {
    super();
    this.updating = updating;
    this.data = category;
  }

  public validate(): Validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
