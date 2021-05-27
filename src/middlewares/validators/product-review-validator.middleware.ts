import { NextFunction, Request, Response } from 'express';

import {
  CreateProductReviewDto,
  DeleteProductReviewDto,
  GetProductReviewDto,
  UpdateProductReviewDto,
} from '../../dto/product-review.dto';
import unprocessableEntity from '../../errors/http/unprocessable-entity.error';
import ProductReviewValidator from '../../validators/product-review.validator';
import ValidatorMiddleware from './validator.middleware';

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

  public static get(req: Request, res: Response, next: NextFunction) {
    const dto: GetProductReviewDto = {
      id: +req.params.id,
    };

    if (!dto.id || isNaN(dto.id)) {
      return unprocessableEntity({
        message: 'Invalid param id.',
      }).send(res);
    }

    req.dto = dto;
    next();
  }

  public static delete(req: Request, res: Response, next: NextFunction) {
    const dto: DeleteProductReviewDto = {
      id: +req.params.id,
    };

    if (!dto.id || isNaN(dto.id)) {
      return unprocessableEntity({
        message: 'Invalid param id.',
      }).send(res);
    }

    req.dto = dto;
    next();
  }
}

export default ProductReviewValidatorMiddleware;
