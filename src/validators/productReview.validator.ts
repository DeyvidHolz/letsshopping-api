import validator from 'validator';
import { ProductReview } from '../entities/ProductReview.entity';
import productReviewValidationRegex from './validationRegex/productReview.validationRegex';

import {
  validation,
  validationMessages,
  Validator,
  validationRegex,
} from './validator';

export default class ProductReviewValidator extends Validator {
  public data: ProductReview;
  public validationErrors: validationMessages[] | null = null;

  protected validationRegex: validationRegex[] = productReviewValidationRegex;

  constructor(productReview: ProductReview, updating: boolean = false) {
    super();
    this.updating = updating;
    this.data = productReview;
  }

  public validate(): validation {
    super.validate();

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
