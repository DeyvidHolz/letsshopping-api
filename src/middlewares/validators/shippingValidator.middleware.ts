import { NextFunction, Request, Response } from 'express';

import { CreateShippingDto, UpdateShippingDto } from '../../dto/shipping.dto';
import unprocessableEntity from '../../errors/http/unprocessableEntity.error';
import { getMessage } from '../../helpers/messages.helper';
import shippingMessages from '../../messages/shipping.messages';
import ShippingValidator from '../../validators/shipping.validator';
import ValidatorMiddleware from './validatorMiddleware';

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
}

export default ShippingValidatorMiddleware;
