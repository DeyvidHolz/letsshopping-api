import { NextFunction, Request, Response } from 'express';

import { CreateShopInfoDto, UpdateShopInfoDto } from '../../dto/shop-info.dto';
import unprocessableEntity from '../../errors/http/unprocessable-entity.error';
import ShopInfoValidator from '../../validators/shop-info.validator';
import ValidatorMiddleware from './validator.middleware';

class ShopInfoValidatorMiddleware extends ValidatorMiddleware {
  public static create(req: Request, res: Response, next: NextFunction) {
    const dto: CreateShopInfoDto = {
      name: req.body.name,
      phones: req.body.phones,
      emails: req.body.emails,
      socials: req.body.socials,
    };

    const validation = new ShopInfoValidator(dto);
    ShopInfoValidatorMiddleware.validate({
      dto,
      validation,
      req,
      res,
      next,
    });
  }

  public static update(req: Request, res: Response, next: NextFunction) {
    const dto: UpdateShopInfoDto = {
      id: req.interceptor.id,
      name: req.body.name,
      phones: req.body.phones,
      emails: req.body.emails,
      socials: req.body.socials,
    };

    const validation = new ShopInfoValidator(dto, true);
    ShopInfoValidatorMiddleware.validate({
      dto,
      validation,
      req,
      res,
      next,
    });
  }
}

export default ShopInfoValidatorMiddleware;
