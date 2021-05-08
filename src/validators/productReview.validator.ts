import {
  CreateProductReviewDto,
  UpdateProductReviewDto,
} from '../dto/productReview.dto';
import productReviewValidationRegex from './validationRegex/productReview.validationRegex';

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
    productReview: CreateProductReviewDto | UpdateProductReviewDto,
    updating: boolean = false,
  ) {
    super();
    this.updating = updating;
    this.data = productReview;
  }

  public validate(): Validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
