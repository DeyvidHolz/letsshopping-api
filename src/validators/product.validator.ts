import { Product } from "../entity/Product";
import { validation, validationMessages, Validator } from './validator';

export default class ProductValidator extends Validator {
  
  public product: Product;
  public validationErrors: validationMessages[] | null = null;

  constructor(product: Product) {
    super();
    this.product = product;
  }

  public validate () : validation
  {
    this.validationErrors = [];

    if (this.product.code.length !== 6) {
      this.validationErrors.push({ field: 'code', message: 'The product code must have 6 characters.'});
    }

    if (!this.product.code.match(/[A-Za-z0-9]+/g)) {
      this.validationErrors.push({ field: 'code', message: 'Invalid product code.'});
    }

    if (!this.product.name.match(/[A-Za-z0-9]+/g)) {
      this.validationErrors.push({ field: 'name', message: 'Invalid product name.'});
    }

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors
    };
  }

}
