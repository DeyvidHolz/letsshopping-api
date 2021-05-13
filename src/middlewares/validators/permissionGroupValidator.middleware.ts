import { NextFunction, Request, Response } from 'express';

import {
  CreatePermissionGroupDto,
  UpdatePermissionGroupDto,
} from '../../dto/permissionGroup.dto';
import unprocessableEntity from '../../errors/http/unprocessableEntity.error';
import PermissionGroupValidator from '../../validators/permissionGroup.validator';
import ValidatorMiddleware from './validatorMiddleware';

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
}

export default PermissionGroupValidatorMiddleware;
