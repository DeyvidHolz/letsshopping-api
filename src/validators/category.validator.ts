import { Category } from '../entities/Category.entity';
import categoryValidationRegex from './validationRegex/category.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class CategoryValidator extends Validator {
  public data: Category;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = categoryValidationRegex;

  constructor(category: Category, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = category;
  }

  public validate(): validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
