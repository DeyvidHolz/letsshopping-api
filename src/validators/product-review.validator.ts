import {
  CreateProductReviewDto,
  UpdateProductReviewDto,
} from '../dto/product-review.dto';
import productReviewValidationRegex from './validationRegex/product-review.validation-regex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class ProductReviewValidator extends Validator {
  public data: CreateProductReviewDto | UpdateProductReviewDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = productReviewValidationRegex;

  constructor(
    productReviewDto: CreateProductReviewDto | UpdateProductReviewDto,
    updating: boolean = false,
  ) {
    super();
    this.updating = updating;
    this.data = productReviewDto;
  }

  public validate(): Validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
