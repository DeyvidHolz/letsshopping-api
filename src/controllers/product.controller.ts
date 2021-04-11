import { getConnection } from "typeorm";
import { Request, Response } from "express";

import { Product } from "../entity/Product";
import { Category } from "../entity/Category";
import ProductValidator from "../validators/product.validator";
import unprocessableEntity from "../errors/http/unprocessableEntity.error";
import internalServerError from "../errors/http/internalServer.error";
import notFound from "../errors/http/notFound.error";

class ProductController {
  private static getRespository() {
    return getConnection().getRepository(Product);
  }

  public static create = async (req: Request, res: Response) => {
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
      const categoryRepository = getConnection().getRepository(Category);
      const categories = await categoryRepository.findByIds(
        req.body.categories
      );
      product.categories = categories;
    }

    const validation = new ProductValidator(product);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: "Invalid data.",
        errors: validation.validationErrors,
      }).send(res);
    }

    try {
      await productRepository.save(product);
      return res.status(201).json({ message: "Product created", product });
    } catch (err) {
      if (err.code === "23505") {
        return unprocessableEntity({
          message: "This code is already in use.",
        }).send(res);
      }

      return internalServerError({ message: err.message }).send(res);
    }
  };

  public static get = async (req: Request, res: Response) => {
    const product = await getConnection()
      .getRepository(Product)
      .findOne(Number(req.params.id), { relations: ["categories"] });
    return res.status(200).json(product);
  };

  public static getAll = async (req: Request, res: Response) => {
    const products = await getConnection()
      .getRepository(Product)
      .find({ relations: ["categories"] });
    return res.status(200).json(products);
  };

  public static update = async (req: Request, res: Response) => {
    const productRepository = ProductController.getRespository();

    const product = await productRepository.findOne(Number(req.body.id));

    if (!product) {
      return notFound({
        message: `Product ${req.body.id} not found.`,
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
        req.body.categories
      );
      product.categories = categories;
    }

    const validation = new ProductValidator(product);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: "Invalid data.",
        errors: validation.validationErrors,
      }).send(res);
    }

    try {
      await productRepository.save(product);
      return res.status(200).json({ message: "Product updated", product });
    } catch (err) {
      if (err.code === "23505") {
        return unprocessableEntity({
          message: "This code is already in use.",
        }).send(res);
      }

      return internalServerError({ message: err.message }).send(res);
    }
  };

  public static delete = async (req: Request, res: Response) => {
    const productRepository = ProductController.getRespository();

    const product = await productRepository.findOne(Number(req.params.id));

    if (!product) {
      return notFound({
        message: `Product ${req.body.id} not found.`,
      }).send(res);
    }

    try {
      await productRepository.delete(product);
      return res.status(200).json({ message: "Product deleted" });
    } catch (err) {
      return internalServerError({ message: err.message }).send(res);
    }
  };
}

export default ProductController;
