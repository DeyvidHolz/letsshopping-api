import { NextFunction, Request, Response } from 'express';

import { CreateProductDto, UpdateProductDto } from '../../dto/product.dto';
import unprocessableEntity from '../../errors/http/unprocessableEntity.error';
import ProductValidator from '../../validators/product.validator';
import ValidatorMiddleware from './validatorMiddleware';

class ProductValidatorMiddleware extends ValidatorMiddleware {
  public static create(req: Request, res: Response, next: NextFunction) {
    const dto: CreateProductDto = {
      code: req.body.code,
      name: req.body.name,
      shortDescription: req.body.shortDescription,
      description: req.body.description,
      mainImage: req.body.mainImage,
      isActive: req.body.isActive,
      stock: req.body.stock,
      price: req.body.price,
      weight: req.body.weight,
      width: req.body.width,
      height: req.body.height,
      categories: req.interceptor.categories,
      images: req.body.images,
      options: req.body.options,
    };

    const validation = new ProductValidator(dto);
    ProductValidatorMiddleware.validate({
      dto,
      validation,
      req,
      res,
      next,
    });
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    const dto: UpdateProductDto = {
      code: req.params.code,
      name: req.body.name,
      shortDescription: req.body.shortDescription,
      description: req.body.description,
      mainImage: req.body.mainImage,
      isActive: req.body.isActive,
      stock: req.body.stock,
      price: req.body.price,
      weight: req.body.weight,
      width: req.body.width,
      height: req.body.height,
      categories: req.interceptor.categories,
      images: req.body.images,
      options: req.body.options,
    };

    if (!dto.code) {
      return unprocessableEntity({
        message: "Param 'code' is required.",
      }).send(res);
    }

    const validation = new ProductValidator(dto, true);
    ProductValidatorMiddleware.validate({
      dto,
      validation,
      req,
      res,
      next,
    });
  }
}

export default ProductValidatorMiddleware;
