import { NextFunction, Request, Response } from 'express';

import {
  CreateProductReviewDto,
  UpdateProductReviewDto,
} from '../../dto/productReview.dto';
import unprocessableEntity from '../../errors/http/unprocessableEntity.error';
import ProductReviewValidator from '../../validators/productReview.validator';
import ValidatorMiddleware from './validatorMiddleware';

class ProductReviewValidatorMiddleware extends ValidatorMiddleware {
  public static create(req: Request, res: Response, next: NextFunction) {
    const dto: CreateProductReviewDto = {
      title: req.body.title,
      rating: req.body.rating,
      description: req.body.description,
      product: req.interceptor.product,
    };

    if (!dto.product.code)
      return unprocessableEntity({
        message: 'Param productCode is required.',
      }).send(res);

    const validation = new ProductReviewValidator(dto);
    ProductReviewValidatorMiddleware.validate({
      dto,
      validation,
      req,
      res,
      next,
    });
  }

  public static update(req: Request, res: Response, next: NextFunction) {
    const dto: UpdateProductReviewDto = {
      id: Number(req.params.id),
      title: req.body.title,
      rating: req.body.rating,
      description: req.body.description,
    };

    const productReviewIdIsEmpty = dto.id === undefined || isNaN(dto.id);

    if (productReviewIdIsEmpty) {
      return unprocessableEntity({
        message: "Field 'id' is required.",
      }).send(res);
    }

    const validation = new ProductReviewValidator(dto, true);
    ProductReviewValidatorMiddleware.validate({
      dto,
      validation,
      req,
      res,
      next,
    });
  }
}

export default ProductReviewValidatorMiddleware;
