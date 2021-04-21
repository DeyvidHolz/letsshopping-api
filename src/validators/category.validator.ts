import { Category } from '../entity/Category.entity';
import { validation, validationMessages, Validator } from './validator';

export default class CategoryValidator extends Validator {
  public category: Category;
  public validationErrors: validationMessages[] | null = null;

  constructor(category: Category) {
    super();
    this.category = category;
  }

  public validate(): validation {
    this.validationErrors = [];

    if (
      !this.category.name.match(/[A-Za-z0-9 ]+/g) ||
      this.category.name === ''
    ) {
      this.validationErrors.push({
        field: 'name',
        message: 'Invalid category name.',
      });
    }

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
