import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import notFound from '../errors/http/notFound.error';
import { Order } from '../entities/Order.entity';
import { Shipping } from '../entities/Shipping.entity';
import {
  createShippingPayload,
  updateShippingPayload,
} from '../types/controllers/shipping.types';
import { getMessage } from '../helpers/messages.helper';
import shippingMessages from '../messages/shipping.messages';
import ShippingValidator from '../validators/shipping.validator';

class ShippingController {
  private static getRepository() {
    return getConnection().getRepository(Shipping);
  }

  public static async create(req: Request, res: Response) {
    const shippingRepository = ShippingController.getRepository();
    const orderRepository = getConnection().getRepository(Order);

    if (!req.body.orderId)
      return unprocessableEntity({
        message: getMessage(shippingMessages.invalidOrderId),
      }).send(res);

    const order = await orderRepository.findOne(req.body.orderId);

    if (!order)
      return notFound({
        message: getMessage(shippingMessages.orderNotFound, {
          id: req.body.orderId,
        }),
      }).send(res);

    req.body.orderId = { id: req.body.orderId };

    const data: createShippingPayload = {
      order: req.body.orderId,
      status: req.body.status,
      events: req.body.events,
    };

    const shipping = shippingRepository.create((data as unknown) as Shipping);
    order.shipping = shipping;

    const validation = new ShippingValidator(shipping);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: validation.first(),
        errors: validation.validationErrors,
      }).send(res);
    }

    await orderRepository.save(order);

    delete shipping.order;

    return res.status(201).json({
      message: getMessage(shippingMessages.created, shipping),
      shipping,
    });
  }

  public static async update(req: Request, res: Response) {
    const shippingRepository = getConnection().getRepository(Shipping);

    if (!req.body.id)
      return unprocessableEntity({
        message: getMessage(shippingMessages.invalidId),
      }).send(res);

    const shipping = await shippingRepository.findOne(req.body.id);

    if (!shipping)
      return notFound({
        message: getMessage(shippingMessages.searchByIDNotFound, {
          id: req.body.id,
        }),
      }).send(res);

    const data: updateShippingPayload = {
      id: req.body.id,
      status: req.body.status,
      events: req.body.events,
    };

    const updatedShipping = shippingRepository.create(
      (data as unknown) as Shipping,
    );

    const validation = new ShippingValidator(shipping);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: validation.first(),
        errors: validation.validationErrors,
      }).send(res);
    }

    await shippingRepository.save(updatedShipping);

    return res.status(201).json({
      message: getMessage(shippingMessages.updated, updatedShipping),
      shipping: updatedShipping,
    });
  }
}

export default ShippingController;
