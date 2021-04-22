import { getConnection, Raw } from 'typeorm';
import { Request, Response } from 'express';

import { Product } from '../entities/Product.entity';
import ProductValidator from '../validators/product.validator';
import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import { getMessage } from '../helpers/messages.helper';
import productMessages from '../messages/product.messages';
import {
  createProductPayload,
  updateProductPayload,
} from '../types/controllers/product.types';
import { ProductOptionValue } from '../entities/ProductOptionValue.entity';

class ProductController {
  private static getRepository() {
    return getConnection().getRepository(Product);
  }

  public static async create(req: Request, res: Response) {
    const productRepository = ProductController.getRepository();

    if (req.body.categories)
      req.body.categories = req.body.categories.map((categoryId) => ({
        id: categoryId,
      }));

    const data: createProductPayload = {
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

    const product = productRepository.create((data as unknown) as Product);

    if (product.options && product.options.length) {
      product.stock = 0;

      product.options.forEach((option) => {
        if (option.values && option.values.length) {
          const productOptionStock = option.values.reduce((value1, value2) => {
            return { ...value1, stock: value1.stock + value2.stock };
          });

          product.stock += productOptionStock.stock;
        }
      });
    }

    const validation = new ProductValidator(product);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: getMessage(productMessages.invalidData),
        errors: validation.validationErrors,
      }).send(res);
    }

    try {
      await productRepository.save(product);

      return res.status(201).json({
        message: getMessage(productMessages.created, product),
        product,
      });
    } catch (err) {
      if (err.code === '23505') {
        return unprocessableEntity({
          message: getMessage(productMessages.alreadyExists),
        }).send(res);
      }

      return internalServerError({ message: err.message }).send(res);
    }
  }

  public static async get(req: Request, res: Response) {
    const productRespository = getConnection().getRepository(Product);
    let product: Product | null = null;

    if (isNaN(Number(req.params.id))) {
      // If it's NaN then it's a product code.
      product = await productRespository.findOne({
        where: { code: req.params.id },
      });
    } else {
      // Else, it can be an ID or a numeric Code
      product = await productRespository.findOne({
        where: [{ id: req.params.id }, { code: req.params.id }],
      });
    }

    if (!product) {
      return notFound({
        message: getMessage(productMessages.searchByIDNotFound, {
          id: req.params.id,
        }),
      }).send(res);
    }

    return res.status(200).json(product);
  }

  public static async getAll(req: Request, res: Response) {
    const products = await getConnection()
      .getRepository(Product)
      .find({
        order: { id: 'DESC' },
      });

    return res.status(200).json(products);
  }

  public static async update(req: Request, res: Response) {
    const productRepository = ProductController.getRepository();

    if (req.body.categories)
      req.body.categories = req.body.categories.map((categoryId) => ({
        id: categoryId,
      }));

    const data: updateProductPayload = {
      id: req.body.id,
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

    const product = productRepository.create((data as unknown) as Product);

    if (product.options && product.options.length) {
      product.stock = 0;

      product.options.forEach((option) => {
        if (option.values && option.values.length) {
          const productOptionStock = option.values.reduce((value1, value2) => {
            return { ...value1, stock: value1.stock + value2.stock };
          });

          product.stock += productOptionStock.stock;
        }
      });
    }

    const validation = new ProductValidator(product);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: getMessage(productMessages.invalidData),
        errors: validation.validationErrors,
      }).send(res);
    }

    try {
      await productRepository.save(product);

      return res.status(200).json({
        message: getMessage(productMessages.update, product),
        product,
      });
    } catch (err) {
      if (err.code === '23505') {
        return unprocessableEntity({
          message: getMessage(productMessages.alreadyExists),
        }).send(res);
      }

      return internalServerError({ message: err.message }).send(res);
    }
  }

  public static async delete(req: Request, res: Response) {
    const productRepository = ProductController.getRepository();

    try {
      await productRepository.delete({ id: req.params.id });

      return res.status(200).json({
        message: getMessage(productMessages.deleted, { id: req.params.id }),
      });
    } catch (err) {
      return internalServerError({ message: err.message }).send(res);
    }
  }

  public static async searchByName(req: Request, res: Response) {
    if (!req.query.name)
      return unprocessableEntity({ message: 'Invalid search criteria.' }).send(
        res,
      );

    const products: Product[] = await ProductController.getRepository().find({
      where: {
        name: Raw(
          (alias) => `LOWER(${alias}) Like LOWER('%${req.query.name}%')`,
        ),
      },
      order: { id: 'DESC' },
    });

    if (!products.length)
      return notFound({ message: 'No products found.' }).send(res);

    return res.status(200).json(products);
  }
}

export default ProductController;
