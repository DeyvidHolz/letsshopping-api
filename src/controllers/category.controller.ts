import { Request, Response } from 'express';
import { getConnection, Raw } from 'typeorm';
import { Category } from '../entities/Category.entity';
import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import { getMessage } from '../helpers/messages.helper';
import categoryMessages from '../messages/category.messages';
import {
  CreateCategoryDto,
  DeleteCategoryDto,
  GetCategoryDto,
  UpdateCategoryDto,
} from '../dto/category.dto';

class CategoryController {
  private static getRepository() {
    return getConnection().getRepository(Category);
  }

  public static async create(req: Request, res: Response) {
    const categoryRepository = CategoryController.getRepository();
    const dto: CreateCategoryDto = req.dto;
    const category = categoryRepository.create(dto as Category);

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
    const dto: GetCategoryDto = req.dto;
    const category = await CategoryController.getRepository().findOne(dto.id);

    if (!category) {
      return notFound({
        message: getMessage(categoryMessages.searchByIDNotFound, {
          id: dto.id,
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
      req.query.includeProducts === 'true' ? true : false;

    const categories: Category[] =
      await CategoryController.getRepository().find({
        order: { id: 'DESC' },
        relations: includeProducts ? ['products'] : [],
      });

    return res.status(200).json(categories);
  }

  public static async searchByName(req: Request, res: Response) {
    const includeProducts: boolean =
      req.query.includeProducts === 'true' ? true : false;

    if (!req.query.name)
      return unprocessableEntity({ message: 'Invalid search criteria.' }).send(
        res,
      );

    const categories: Category[] =
      await CategoryController.getRepository().find({
        where: {
          name: Raw(
            (alias) => `LOWER(${alias}) Like LOWER('%${req.query.name}%')`,
          ),
        },
        order: { id: 'DESC' },
        relations: includeProducts ? ['products'] : [],
      });

    if (!categories.length)
      return notFound({ message: 'No categories found.' }).send(res);

    return res.status(200).json(categories);
  }

  public static async update(req: Request, res: Response) {
    const categoryRepository = CategoryController.getRepository();
    const dto: UpdateCategoryDto = req.dto;
    const category = await categoryRepository.create(dto as Category);

    // ! useless if statement
    // TODO: query category instead of just use .create, then update data. Keep this 'if'.
    if (!category) {
      return notFound({
        message: getMessage(categoryMessages.searchByIDNotFound, {
          id: dto.id,
        }),
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
    const dto: DeleteCategoryDto = req.dto;

    try {
      await categoryRepository.delete({ id: dto.id });

      return res.status(200).json({
        message: getMessage(categoryMessages.deleted, { id: dto.id }),
      });
    } catch (err) {
      return internalServerError({ message: err.message }).send(res);
    }
  }
}

export default CategoryController;
