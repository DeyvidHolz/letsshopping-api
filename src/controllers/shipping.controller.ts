import { getConnection } from 'typeorm';
import { Request, Response } from 'express';
import decode from 'jwt-decode';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import unauthorized from '../errors/http/unauthorized';
import { Coupon } from '../entity/Coupon';
import { Order } from '../entity/Order';
import { getUserData } from '../helpers/auth.helper';
import { Cart } from '../entity/Cart';
import { User } from '../entity/User';
import { OrderAddress } from '../entity/OrderAddress';
import { Address } from '../entity/Address';
import { CartProduct } from '../entity/CartProduct';
import { Shipping } from '../entity/Shipping';

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

    const shippingOrder = { ...req.body, order: { id: req.body.orderId } };

    const shipping = shippingRepository.create(shippingOrder as Shipping);
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

    const updatedShipping = shippingRepository.create(req.body as Shipping);
    await shippingRepository.save(updatedShipping);

    return res
      .status(201)
      .json({ message: 'Shipping updated.', shipping: updatedShipping });
  }
}

export default ShippingController;
