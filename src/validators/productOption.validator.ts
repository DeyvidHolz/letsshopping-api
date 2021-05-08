import { CreateProductOptionDto } from '../dto/productOption.dto';
import ProductOptionValueValidator from './productOptionValue.validator';
import productOptionValidationRegex from './validationRegex/productOption.validationRegex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class ProductOptionValidator extends Validator {
  public data: CreateProductOptionDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = productOptionValidationRegex;

  constructor(
    productOption: CreateProductOptionDto,
    updating: boolean = false,
  ) {
    super();
    this.updating = updating;
    this.data = productOption;
  }

  public validate(): Validation {
    super.validate();

    // Implementing ProductOptionValue validations
    if (this.data.values && this.data.values.length) {
      this.data.values.forEach((optionValue) => {
        const optionValueValidation = new ProductOptionValueValidator(
          optionValue,
        );
        if (optionValueValidation.hasErrors()) {
          this.addError('values', optionValueValidation.first());
          return;
        }
      });
    }

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
