import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import unprocessableEntity from '../errors/http/unprocessable-entity.error';
import notFound from '../errors/http/not-found.error';
import { Order } from '../entities/order.entity';
import { Shipping } from '../entities/shipping.entity';
import {
  CreateShippingDto,
  GetShippingDto,
  UpdateShippingDto,
} from '../dto/shipping.dto';
import { getMessage } from '../helpers/messages.helper';
import shippingMessages from '../messages/shipping.messages';
import ShippingValidator from '../validators/shipping.validator';

class ShippingController {
  private static getRepository() {
    return getConnection().getRepository(Shipping);
  }

  public static async create(req: Request, res: Response) {
    const shippingRepository = ShippingController.getRepository();
    const dto: CreateShippingDto = req.dto;
    const orderRepository = getConnection().getRepository(Order);
    const order = await orderRepository.findOne(dto.order.id);

    if (!order)
      return notFound({
        message: getMessage(shippingMessages.orderNotFound, {
          id: dto.order.id,
        }),
      }).send(res);

    const shipping = shippingRepository.create(dto as unknown as Shipping);
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
    const dto: UpdateShippingDto = req.dto;
    const shipping = await shippingRepository.findOne(dto.id);

    if (!shipping)
      return notFound({
        message: getMessage(shippingMessages.searchByIDNotFound, {
          id: dto.id,
        }),
      }).send(res);

    // TODO: some fields cannot be updated. Create something to handle it.
    // ! Create route to add events, remove it from middleware. Or: add event here querying and do shipping.events = [...shipingEvents, ...newEvents]
    const updatedShipping = shippingRepository.create(dto as Shipping);
    await shippingRepository.save(updatedShipping);

    return res.status(200).json({
      message: getMessage(shippingMessages.updated, updatedShipping),
      shipping: updatedShipping,
    });
  }

  public static async get(req: Request, res: Response) {
    const shippingRepository = getConnection().getRepository(Shipping);
    const dto: GetShippingDto = req.dto;

    const shipping = await shippingRepository.findOne(dto.id);

    if (!shipping) {
      return notFound({
        message: getMessage(shippingMessages.searchByIDNotFound, {
          id: req.dto.id,
        }),
      }).send(res);
    }

    return res.json(shipping);
  }
}

export default ShippingController;
