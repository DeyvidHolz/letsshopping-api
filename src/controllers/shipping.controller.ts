import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import notFound from '../errors/http/notFound.error';
import { Order } from '../entities/Order.entity';
import { Shipping } from '../entities/Shipping.entity';
import { createShippingDto, updateShippingDto } from '../dto/shipping.dto';
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

    const data: createShippingDto = {
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
    const shippingId: number = Number(req.params.id);

    if (!shippingId)
      return unprocessableEntity({
        message: getMessage(shippingMessages.invalidId),
      }).send(res);

    const shipping = await shippingRepository.findOne(shippingId);

    if (!shipping)
      return notFound({
        message: getMessage(shippingMessages.searchByIDNotFound, {
          id: shippingId,
        }),
      }).send(res);

    const data: updateShippingDto = {
      id: shippingId,
      status: req.body.status,
      events: req.body.events,
    };

    const updatedShipping = shippingRepository.create(
      (data as unknown) as Shipping,
    );

    const validation = new ShippingValidator(shipping, true);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: validation.first(),
        errors: validation.validationErrors,
      }).send(res);
    }

    await shippingRepository.save(updatedShipping);

    return res.status(200).json({
      message: getMessage(shippingMessages.updated, updatedShipping),
      shipping: updatedShipping,
    });
  }
}

export default ShippingController;
