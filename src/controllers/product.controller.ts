import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import { Product } from '../entity/Product';
import { Category } from '../entity/Category';
import ProductValidator from '../validators/product.validator';
import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import { getMessage } from '../helpers/messages.helper';
import productMessages from '../messages/product.messages';
import { option } from '../types/entities/productOptionIn.types';
import { ProductOption } from '../entity/ProductOption';
import { ProductOptionValue } from '../entity/ProductOptionValue';

class ProductController {
  private static getRespository() {
    return getConnection().getRepository(Product);
  }

  public static async create(req: Request, res: Response) {
    const productRepository = ProductController.getRespository();

    const product = new Product();
    product.code = req.body.code;
    product.name = req.body.name;
    product.shortDescription = req.body.shortDescription;
    product.description = req.body.description;
    product.mainImage = req.body.mainImage;
    product.isActive = req.body.isActive;
    product.stock = req.body.stock;

    if (req.body.categories) {
      product.categories = <any>[
        ...req.body.categories.map((id: number) => ({ id })),
      ];
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

      // @TODO: refactore that. Too many queries.
      if (req.body.options) {
        const optionRepository = getConnection().getRepository(ProductOption);
        const optionValueRepository = getConnection().getRepository(
          ProductOptionValue,
        );

        const optionsToCreate = req.body.options
          .map((option) => {
            if (typeof option !== 'object') return;
            return option;
          })
          .filter((option: any) => option !== undefined);

        optionsToCreate.forEach(async (opt: any) => {
          const option = new ProductOption();
          option.name = opt.name;
          option.product = product;
          await optionRepository.save(option);

          const optionValues: ProductOptionValue[] = new Array<ProductOptionValue>();

          opt.values.forEach((value: any) => {
            const optionValue = new ProductOptionValue();
            optionValue.isActive = value.isActive;
            optionValue.mainImage = value.mainImage;
            optionValue.option = option;
            optionValue.price = value.price;
            optionValue.stock = value.stock;
            optionValue.value = value.value;
            optionValues.push(optionValue);
          });

          await optionValueRepository.save(optionValues);
          option.values = optionValues;
          await optionRepository.save(option);
        });
      }

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
    const productRepository = ProductController.getRespository();

    const productIDisEmpty = req.body.id === undefined || req.body.id === '';

    if (productIDisEmpty) {
      return unprocessableEntity({
        message: "Field 'id' is required.",
      }).send(res);
    }

    const product = await productRepository.findOne(Number(req.body.id));

    if (!product) {
      return notFound({
        message: getMessage(productMessages.searchByIDNotFound, {
          id: req.body.id,
        }),
      }).send(res);
    }

    product.code = req.body.code ?? product.code;
    product.name = req.body.name ?? product.name;
    product.shortDescription =
      req.body.shortDescription ?? product.shortDescription;
    product.description = req.body.description ?? product.description;
    product.mainImage = req.body.mainImage ?? product.mainImage;
    product.isActive = req.body.isActive ?? product.isActive;
    product.stock =
      req.body.stock === 0 || req.body.stock ? req.body.stock : product.stock;

    if (req.body.categories) {
      const categoryRepository = getConnection().getRepository(Category);
      const categories = await categoryRepository.findByIds(
        req.body.categories,
      );
      product.categories = categories;
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
        message: getMessage(productMessages.updated, product),
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
    const productRepository = ProductController.getRespository();

    try {
      await productRepository.delete({ id: req.params.id });

      return res.status(200).json({
        message: getMessage(productMessages.deleted, { id: req.params.id }),
      });
    } catch (err) {
      return internalServerError({ message: err.message }).send(res);
    }
  }
}

export default ProductController;
