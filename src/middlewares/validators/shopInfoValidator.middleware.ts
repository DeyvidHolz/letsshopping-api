import { NextFunction, Request, Response } from 'express';

import { CreateShopInfoDto, UpdateShopInfoDto } from '../../dto/shopInfo.dto';
import unprocessableEntity from '../../errors/http/unprocessableEntity.error';
import ShopInfoValidator from '../../validators/shopInfo.validator';
import ValidatorMiddleware from './validatorMiddleware';

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
      // TODO: interceptor should do this "id: 1"
      id: 1,
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
