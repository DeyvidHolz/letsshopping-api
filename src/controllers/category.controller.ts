import { getConnection, Like, Raw } from 'typeorm';
import { Request, Response } from 'express';

import { Product } from '../entity/Product';
import { Category } from '../entity/Category';
import CategoryValidator from '../validators/category.validator';
import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import { getMessage } from '../helpers/messages.helper';
import categoryMessages from '../messages/category.messages';

class CategoryController {
  private static getRepository() {
    return getConnection().getRepository(Category);
  }

  public static async create(req: Request, res: Response) {
    const categoryRepository = CategoryController.getRepository();

    const category = new Category();
    category.name = req.body.name;
    category.shortDescription = req.body.shortDescription ?? null;
    category.description = req.body.description ?? null;

    const validation = new CategoryValidator(category);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: getMessage(categoryMessages.invalidData),
        errors: validation.validationErrors,
      }).send(res);
    }

    try {
      await categoryRepository.save(category);
      return res.status(201).json({
        message: getMessage(categoryMessages.created, category),
        category,
      });
    } catch (err) {
      return internalServerError({ message: err.message }).send(res);
    }
  }

  public static async get(req: Request, res: Response) {
    const category = await CategoryController.getRepository().findOne(
      Number(req.params.id),
    );

    if (!category) {
      return notFound({
        message: getMessage(categoryMessages.searchByIDNotFound, {
          id: Number(req.params.id),
        }),
      }).send(res);
    }

    return res.status(200).json(category);
  }

  public static async getProductsByCategory(req: Request, res: Response) {
    const category = await CategoryController.getRepository().findOne(
      Number(req.params.id),
      { relations: ['products'] },
    );

    if (!category) {
      return notFound({
        message: getMessage(categoryMessages.searchByIDNotFound, {
          id: Number(req.params.id),
        }),
      }).send(res);
    }

    return res.status(200).json(category);
  }

  public static async getAll(req: Request, res: Response) {
    const includeProducts: boolean =
      req.query['include-products'] === 'true' ? true : false;

    const categories: Category[] = await CategoryController.getRepository().find(
      {
        order: { id: 'DESC' },
        relations: includeProducts ? ['products'] : [],
      },
    );

    return res.status(200).json(categories);
  }

  public static async searchByName(req: Request, res: Response) {
    const includeProducts: boolean =
      req.query['include-products'] === 'true' ? true : false;

    if (!req.query.name)
      return unprocessableEntity({ message: 'Invalid search criteria.' }).send(
        res,
      );

    const categories: Category[] = await CategoryController.getRepository().find(
      {
        where: {
          name: Raw(
            (alias) => `LOWER(${alias}) Like LOWER('%${req.query.name}%')`,
          ),
        },
        order: { id: 'DESC' },
        relations: includeProducts ? ['products'] : [],
      },
    );

    if (!categories.length)
      return notFound({ message: 'No categories found.' }).send(res);

    return res.status(200).json(categories);
  }

  public static async update(req: Request, res: Response) {
    const categoryRepository = CategoryController.getRepository();

    const categoryIDisEmpty = req.body.id === undefined || req.body.id === '';

    if (categoryIDisEmpty) {
      return unprocessableEntity({
        message: "Field 'id' is required.",
      }).send(res);
    }

    const category = await categoryRepository.findOne(Number(req.body.id));

    if (!category) {
      return notFound({
        message: getMessage(categoryMessages.searchByIDNotFound, {
          id: Number(req.body.id),
        }),
      }).send(res);
    }

    category.name = req.body.name ?? category.name;
    category.shortDescription =
      req.body.shortDescription ?? category.shortDescription;
    category.description = req.body.description ?? category.description;

    const validation = new CategoryValidator(category);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: getMessage(categoryMessages.invalidData),
        errors: validation.validationErrors,
      }).send(res);
    }

    try {
      await categoryRepository.save(category);
      return res.status(200).json({
        message: getMessage(categoryMessages.updated, category),
        category,
      });
    } catch (err) {
      return internalServerError({ message: err.message }).send(res);
    }
  }

  public static async delete(req: Request, res: Response) {
    const categoryRepository = CategoryController.getRepository();

    try {
      const id = Number(req.params.id);
      await categoryRepository.delete({ id });

      return res.status(200).json({
        message: getMessage(categoryMessages.deleted, { id }),
      });
    } catch (err) {
      return internalServerError({ message: err.message }).send(res);
    }
  }
}

export default CategoryController;
