import { NextFunction, Request, Response } from 'express';
import { getConnection } from 'typeorm';

import { CreateProductDto, UpdateProductDto } from '../../dto/product.dto';
import { Product } from '../../entities/Product.entity';
import notFound from '../../errors/http/notFound.error';
import unprocessableEntity from '../../errors/http/unprocessableEntity.error';
import { getMessage } from '../../helpers/messages.helper';
import productMessages from '../../messages/product.messages';
import ProductValidator from '../../validators/product.validator';
import ValidatorMiddleware from './validatorMiddleware';

class ProductValidatorMiddleware extends ValidatorMiddleware {
  public static create(req: Request, res: Response, next: NextFunction) {
    // TODO: create something (like a pipe) to do this stuff. Avoid code duplication.
    if (req.body.categories)
      req.body.categories = req.body.categories.map((categoryId) => ({
        id: categoryId,
      }));

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
      categories: req.body.categories,
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
    if (req.body.categories)
      req.body.categories = req.body.categories.map((categoryId) => ({
        id: categoryId,
      }));

    const dto: UpdateProductDto = {
      id: 0,
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
      categories: req.body.categories,
      images: req.body.images,
      options: req.body.options,
    };

    if (!dto.code) {
      return unprocessableEntity({
        message: "Field 'id' is required.",
      }).send(res);
    }

    // TODO: Create interceptor for this.
    // Getting ID of product
    const productRepository = getConnection().getRepository(Product);
    const product = await productRepository.findOne({ code: dto.code });

    if (!product)
      return notFound({
        message: getMessage(productMessages.notFound, { code: dto.code }),
      }).send(res);

    // Setting id
    dto.id = Number(product.id);

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
