import { NextFunction, Request, Response } from 'express';

import { CreateCouponDto, UpdateCouponDto } from '../../dto/coupon.dto';
import unprocessableEntity from '../../errors/http/unprocessableEntity.error';
import CouponValidator from '../../validators/coupon.validator';
import ValidatorMiddleware from './validatorMiddleware';

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
        message: "Field 'id' is required.",
      }).send(res);
    }

    const validation = new CouponValidator(dto, true);
    CouponValidatorMiddleware.validate({ dto, validation, req, res, next });
  }
}

export default CouponValidatorMiddleware;
