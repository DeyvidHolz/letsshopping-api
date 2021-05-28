import { CreateProductOptionValueDto } from '../dtos/product-option-value.dto';
import productOptionValueValidationRegex from './validationRegex/product-option-value.validation-regex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class ProductOptionValueValidator extends Validator {
  public data: CreateProductOptionValueDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] =
    productOptionValueValidationRegex;

  constructor(
    productOptionValueDto: CreateProductOptionValueDto,
    updating: boolean = false,
  ) {
    super();
    this.updating = updating;
    this.data = productOptionValueDto;
  }

  public validate(): Validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
