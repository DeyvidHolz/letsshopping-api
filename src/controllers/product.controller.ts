import { Request, Response } from 'express';
import { getConnection, Raw } from 'typeorm';
import { Product } from '../entities/product.entity';
import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import { getMessage } from '../helpers/messages.helper';
import productMessages from '../messages/product.messages';
import {
  CreateProductDto,
  DeleteProductDto,
  GetProductDto,
  UpdateProductDto,
} from '../dto/product.dto';

class ProductController {
  private static getRepository() {
    return getConnection().getRepository(Product);
  }

  public static async create(req: Request, res: Response) {
    const productRepository = ProductController.getRepository();
    const dto: CreateProductDto = req.dto;
    const product = productRepository.create(dto as Product);

    // Updating stock based on options
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
    const dto: GetProductDto = req.dto;

    let product = await productRespository.findOne({
      where: { code: dto.code },
    });

    if (!product) {
      return notFound({
        message: getMessage(productMessages.searchByCodeNotFound, {
          code: dto.code,
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
    const dto: UpdateProductDto = req.dto;
    const oldProduct = await productRepository.findOne({ code: dto.code });

    if (!oldProduct)
      return notFound({
        message: getMessage(productMessages.notFound, { code: dto.code }),
      }).send(res);

    dto.id = Number(oldProduct.id);
    const product = productRepository.create(dto as unknown as Product);

    // Updating stock based on options
    // TODO: duplicated code. Put this in a SUBSCRIBER.
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
    const dto: DeleteProductDto = req.dto;

    try {
      await productRepository.delete({ code: dto.code });

      return res.status(200).json({
        message: getMessage(productMessages.deleted, { code: dto.code }),
      });
    } catch (err) {
      return internalServerError({ message: err.message }).send(res);
    }
  }

  public static async searchByName(req: Request, res: Response) {
    if (!req.query.name)
      return unprocessableEntity({
        message: getMessage(productMessages.invalidSearchCriteria),
      }).send(res);

    const products: Product[] = await ProductController.getRepository().find({
      where: {
        name: Raw(
          (alias) => `LOWER(${alias}) Like LOWER('%${req.query.name}%')`,
        ),
      },
      order: { id: 'DESC' },
    });

    if (!products.length)
      return notFound({
        message: getMessage(productMessages.noProductsFound),
      }).send(res);

    return res.status(200).json(products);
  }
}

export default ProductController;
