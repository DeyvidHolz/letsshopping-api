import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import notFound from '../errors/http/notFound.error';
import { Order } from '../entities/Order.entity';
import { Shipping } from '../entities/Shipping.entity';
import { CreateShippingDto, UpdateShippingDto } from '../dto/shipping.dto';
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
    const order = await orderRepository.findOne(req.dto.order.id);

    if (!order)
      return notFound({
        message: getMessage(shippingMessages.orderNotFound, {
          id: req.body.orderId,
        }),
      }).send(res);

    const shipping = shippingRepository.create(req.dto as Shipping);
    order.shipping = shipping;
    await orderRepository.save(order);

    delete shipping.order;

    return res.status(201).json({
      message: getMessage(shippingMessages.created, shipping),
      shipping,
    });
  }

  public static async update(req: Request, res: Response) {
    const shippingRepository = getConnection().getRepository(Shipping);

    const shipping = await shippingRepository.findOne(req.dto.id);

    if (!shipping)
      return notFound({
        message: getMessage(shippingMessages.searchByIDNotFound, {
          id: req.dto.id,
        }),
      }).send(res);

    // TODO: some fields cannot be updated. Create something to handle it.
    const updatedShipping = shippingRepository.create(req.dto as Shipping);
    await shippingRepository.save(updatedShipping);

    return res.status(200).json({
      message: getMessage(shippingMessages.updated, updatedShipping),
      shipping: updatedShipping,
    });
  }
}

export default ShippingController;
