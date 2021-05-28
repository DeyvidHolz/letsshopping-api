import { NextFunction, Request, Response } from 'express';

import {
  CreatePermissionGroupDto,
  DeletePermissionGroupDto,
  GetPermissionGroupDto,
  UpdatePermissionGroupDto,
} from '../../dtos/permission-group.dto';
import unprocessableEntity from '../../errors/http/unprocessable-entity.error';
import PermissionGroupValidator from '../../validators/permission-group.validator';
import ValidatorMiddleware from './validator.middleware';

class PermissionGroupValidatorMiddleware extends ValidatorMiddleware {
  public static create(req: Request, res: Response, next: NextFunction) {
    const dto: CreatePermissionGroupDto = {
      name: req.body.name,
      level: req.body.level,
    };

    const validation = new PermissionGroupValidator(dto);
    PermissionGroupValidatorMiddleware.validate({
      dto,
      validation,
      req,
      res,
      next,
    });
  }

  public static update(req: Request, res: Response, next: NextFunction) {
    const dto: UpdatePermissionGroupDto = {
      name: req.params.name,
      level: req.body.level,
    };

    const validation = new PermissionGroupValidator(dto, true);
    PermissionGroupValidatorMiddleware.validate({
      dto,
      validation,
      req,
      res,
      next,
    });
  }

  public static setUserPermissionGroup(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const permissionGroupName: string = req.params.name;
    const userId: number = Number(req.params.userId);

    if (isNaN(userId))
      return unprocessableEntity({ message: 'Invalid user ID.' }).send(res);
    if (!permissionGroupName)
      return unprocessableEntity({ message: 'Invalid group name.' });

    next();
  }

  public static get(req: Request, res: Response, next: NextFunction) {
    const dto: GetPermissionGroupDto = { name: req.params.name };

    if (!dto.name) {
      return unprocessableEntity({
        message: 'Invalid param name.',
      }).send(res);
    }

    req.dto = dto;
    next();
  }

  public static delete(req: Request, res: Response, next: NextFunction) {
    const dto: DeletePermissionGroupDto = { name: req.params.name };

    if (!dto.name) {
      return unprocessableEntity({
        message: 'Invalid param name.',
      }).send(res);
    }

    req.dto = dto;
    next();
  }
}

export default PermissionGroupValidatorMiddleware;
