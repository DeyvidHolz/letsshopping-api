import { NextFunction, Request, Response } from 'express';

import {
  CreateCouponDto,
  DeleteCouponDto,
  GetCouponDto,
  UpdateCouponDto,
} from '../../dto/coupon.dto';
import unprocessableEntity from '../../errors/http/unprocessableEntity.error';
import { getMessage } from '../../helpers/messages.helper';
import couponMessages from '../../messages/coupon.messages';
import CouponValidator from '../../validators/coupon.validator';
import ValidatorMiddleware from './validator.middleware';

class CouponValidatorMiddleware extends ValidatorMiddleware {
  public static create(req: Request, res: Response, next: NextFunction) {
    const dto: CreateCouponDto = {
      code: req.body.code,
      name: req.body.name,
      description: req.body.description,
      discountType: req.body.discountType,
      discountAmount: req.body.discountAmount,
      maxUsesPerUser: req.body.maxUsesPerUser,
      maxUsers: req.body.maxUsers,
      isActive: req.body.isActive,
      ruleMinPrice: req.body.ruleMinPrice,
    };

    const validation = new CouponValidator(dto);
    CouponValidatorMiddleware.validate({ dto, validation, req, res, next });
  }

  public static update(req: Request, res: Response, next: NextFunction) {
    const dto: UpdateCouponDto = {
      id: Number(req.params.id),
      code: req.body.code,
      name: req.body.name,
      description: req.body.description,
      discountType: req.body.discountType,
      discountAmount: req.body.discountAmount,
      maxUsesPerUser: req.body.maxUsesPerUser,
      maxUsers: req.body.maxUsers,
      isActive: req.body.isActive,
      ruleMinPrice: req.body.ruleMinPrice,
    };

    const couponIdIsEmpty = dto.id === undefined || isNaN(dto.id);

    if (couponIdIsEmpty) {
      return unprocessableEntity({
        message: getMessage(couponMessages.invalidId, { id: dto.id }),
      }).send(res);
    }

    const validation = new CouponValidator(dto, true);
    CouponValidatorMiddleware.validate({ dto, validation, req, res, next });
  }

  public static get(req: Request, res: Response, next: NextFunction) {
    const dto: GetCouponDto = {
      id: +req.params.id,
    };

    if (!dto.id || isNaN(dto.id)) {
      return unprocessableEntity({
        message: 'Invalid param id.',
      }).send(res);
    }

    req.dto = dto;
    next();
  }

  public static delete(req: Request, res: Response, next: NextFunction) {
    const dto: DeleteCouponDto = {
      id: +req.params.id,
    };

    if (!dto.id || isNaN(dto.id)) {
      return unprocessableEntity({
        message: 'Invalid param id.',
      }).send(res);
    }

    req.dto = dto;
    next();
  }
}

export default CouponValidatorMiddleware;
