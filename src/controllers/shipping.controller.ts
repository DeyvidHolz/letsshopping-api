import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import notFound from '../errors/http/notFound.error';
import { Order } from '../entity/Order.entity';
import { Shipping } from '../entity/Shipping.entity';
import {
  createShippingPayload,
  updateShippingPayload,
} from '../types/controllers/shipping.types';

class ShippingController {
  private static getRepository() {
    return getConnection().getRepository(Shipping);
  }

  public static async create(req: Request, res: Response) {
    const shippingRepository = ShippingController.getRepository();
    const orderRepository = getConnection().getRepository(Order);

    if (!req.body.orderId)
      return unprocessableEntity({
        message: 'Field orderId is required.',
      }).send(res);

    const order = await orderRepository.findOne(req.body.orderId);

    if (!order)
      return notFound({ message: `Order with ID ${order.id} not found.` }).send(
        res,
      );

    req.body.orderId = { id: req.body.orderId };

    const data: createShippingPayload = {
      order: req.body.orderId,
      status: req.body.status,
      events: req.body.events,
    };

    const shipping = shippingRepository.create((data as unknown) as Shipping);
    order.shipping = shipping;

    await orderRepository.save(order);

    delete shipping.order;

    return res
      .status(201)
      .json({ message: 'Shipping created successfully.', shipping });
  }

  public static async update(req: Request, res: Response) {
    const shippingRepository = getConnection().getRepository(Shipping);

    if (!req.body.id)
      return unprocessableEntity({
        message: 'Field id is required.',
      }).send(res);

    const shipping = await shippingRepository.findOne(req.body.id);

    if (!shipping)
      return notFound({
        message: `Shipping with ID ${req.body.id} not found.`,
      }).send(res);

    const data: updateShippingPayload = {
      id: req.body.id,
      status: req.body.status,
      events: req.body.events,
    };

    const updatedShipping = shippingRepository.create(
      (data as unknown) as Shipping,
    );
    await shippingRepository.save(updatedShipping);

    return res
      .status(201)
      .json({ message: 'Shipping updated.', shipping: updatedShipping });
  }
}

export default ShippingController;
