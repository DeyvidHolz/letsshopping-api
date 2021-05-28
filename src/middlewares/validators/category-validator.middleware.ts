import { NextFunction, Request, Response } from 'express';

import {
  CreateCategoryDto,
  DeleteCategoryDto,
  GetCategoryDto,
  UpdateCategoryDto,
} from '../../dtos/category.dto';
import unprocessableEntity from '../../errors/http/unprocessable-entity.error';
import CategoryValidator from '../../validators/category.validator';
import ValidatorMiddleware from './validator.middleware';

class CategoryValidatorMiddleware extends ValidatorMiddleware {
  public static create(req: Request, res: Response, next: NextFunction) {
    const dto: CreateCategoryDto = {
      name: req.body.name,
      shortDescription: req.body.shortDescription,
      description: req.body.description,
    };

    const validation = new CategoryValidator(dto);
    CategoryValidatorMiddleware.validate({ dto, validation, req, res, next });
  }

  public static update(req: Request, res: Response, next: NextFunction) {
    const dto: UpdateCategoryDto = {
      id: Number(req.params.id),
      name: req.body.name,
      shortDescription: req.body.shortDescription,
      description: req.body.description,
    };

    // TODO: make a function for this work.
    const categoryIdIsEmpty = dto.id === undefined || isNaN(dto.id);

    if (categoryIdIsEmpty) {
      return unprocessableEntity({
        message: "Field 'id' is required.",
      }).send(res);
    }

    const validation = new CategoryValidator(dto, true);
    CategoryValidatorMiddleware.validate({ dto, validation, req, res, next });
  }

  public static get(req: Request, res: Response, next: NextFunction) {
    const dto: GetCategoryDto = {
      id: +req.params.id,
    };

    if (!dto.id || isNaN(dto.id)) {
      return unprocessableEntity({
        message: 'Invalid param code.',
      }).send(res);
    }

    req.dto = dto;
    next();
  }

  public static delete(req: Request, res: Response, next: NextFunction) {
    const dto: DeleteCategoryDto = {
      id: +req.params.id,
    };

    if (!dto.id || isNaN(dto.id)) {
      return unprocessableEntity({
        message: 'Invalid param code.',
      }).send(res);
    }

    req.dto = dto;
    next();
  }
}

export default CategoryValidatorMiddleware;
