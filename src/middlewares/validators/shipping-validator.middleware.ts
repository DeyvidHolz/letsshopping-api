import { NextFunction, Request, Response } from 'express';

import {
  CreateShippingDto,
  GetShippingDto,
  UpdateShippingDto,
} from '../../dto/shipping.dto';
import unprocessableEntity from '../../errors/http/unprocessable-entity.error';
import ShippingValidator from '../../validators/shipping.validator';
import ValidatorMiddleware from './validator.middleware';

class ShippingValidatorMiddleware extends ValidatorMiddleware {
  public static create(req: Request, res: Response, next: NextFunction) {
    const dto: CreateShippingDto = {
      order: { id: req.body.orderId },
      status: req.body.status,
      events: req.body.events,
    };

    const orderIdIsEmpty = dto.order.id === undefined || isNaN(dto.order.id);
    if (orderIdIsEmpty) {
      return unprocessableEntity({
        message: "Field 'id' is required.",
      }).send(res);
    }

    const validation = new ShippingValidator(dto);
    ShippingValidatorMiddleware.validate({
      dto,
      validation,
      req,
      res,
      next,
    });
  }

  public static update(req: Request, res: Response, next: NextFunction) {
    const dto: UpdateShippingDto = {
      id: Number(req.params.id),
      status: req.body.status,
      events: req.body.events,
    };

    const shippingIdIsEmpty = dto.id === undefined || isNaN(dto.id);

    if (shippingIdIsEmpty) {
      return unprocessableEntity({
        message: "Field 'id' is required.",
      }).send(res);
    }

    const validation = new ShippingValidator(dto, true);
    ShippingValidatorMiddleware.validate({
      dto,
      validation,
      req,
      res,
      next,
    });
  }

  public static get(req: Request, res: Response, next: NextFunction) {
    const dto: GetShippingDto = {
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

export default ShippingValidatorMiddleware;
