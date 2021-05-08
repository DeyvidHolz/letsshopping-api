import { getConnection } from 'typeorm';
import { Request, Response } from 'express';
import decode from 'jwt-decode';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import unauthorized from '../errors/http/unauthorized';
import { Coupon } from '../entities/Coupon.entity';
import { Order } from '../entities/Order.entity';
import { Cart } from '../entities/Cart.entity';
import { User } from '../entities/User.entity';
import { OrderAddress } from '../entities/OrderAddress.entity';
import { Address } from '../entities/Address.entity';
import { CartProduct } from '../entities/CartProduct.entity';
import { getMessage } from '../helpers/messages.helper';
import orderMessages from '../messages/order.messages';
import OrderValidator from '../validators/order.validator';

class OrderController {
  private static getRepository() {
    return getConnection().getRepository(Order);
  }

  public static async create(req: Request, res: Response) {
    const orderRepository = OrderController.getRepository();
    const cartRepository = getConnection().getRepository(Cart);
    const cartProductRepository = getConnection().getRepository(CartProduct);
    const userRepository = getConnection().getRepository(User);
    const addressRepository = getConnection().getRepository(Address);
    const orderAddressRepository = getConnection().getRepository(OrderAddress);

    if (!req.body.shippingAddressId)
      return unprocessableEntity({
        message: getMessage(orderMessages.invalidShippingAddress),
      }).send(res);

    const user = await userRepository.findOne(req.user.id, {
      relations: ['addresses'],
    });

    const userSentAddress = await addressRepository.findOne({
      where: { id: req.body.shippingAddressId, user: { id: req.user.id } },
    });

    if (!userSentAddress)
      return unprocessableEntity({
        message: getMessage(orderMessages.shippingAddressNotFound),
      }).send(res);

    const shippingAddress = orderAddressRepository.create(userSentAddress);

    const cart = await cartRepository.findOne({
      where: { user: { id: req.user.id } },
    });

    if (!cart.cartProducts.length) {
      return unprocessableEntity({
        message: getMessage(orderMessages.noItemsInCart, cart),
      }).send(res);
    }

    const order = orderRepository.create(req.body as Order);
    order.totalValue = cart.total;
    order.subtotal = cart.subtotal;
    order.paymentMethod = 0;
    order.items = [...cart.cartProducts.map((cp) => cp.product)];
    order.user = user;
    order.address = user.addresses.find((a) => a.isMain);
    order.shippingAddress = shippingAddress;

    // TODO: calculate freight fee
    order.freightValue = 15;

    // TODO: try to charge then set status
    order.status = 0;

    // TODO: // TODO: try to charge then set order events
    // order.events = OrderEvent[]

    if (!order.address)
      return unprocessableEntity({
        message: getMessage(orderMessages.addressRequired),
      }).send(res);

    const validation = new OrderValidator(order);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: validation.first(),
        errors: validation.validationErrors,
      }).send(res);
    }

    await orderRepository.save(order, { reload: true });
    await cartProductRepository.remove(cart.cartProducts);

    cart.total = 0;
    cart.cartProducts = [];
    cart.subtotal = 0;
    await cartRepository.save(cart);

    return res
      .status(201)
      .json({ message: getMessage(orderMessages.created), order });
  }

  public static async get(req: Request, res: Response) {
    const orderRepository = OrderController.getRepository();

    const order = await orderRepository.findOne({
      where: { id: req.params.id, user: { id: req.user.id } },
    });

    if (!order) {
      return notFound({
        message: getMessage(orderMessages.notFound),
      }).send(res);
    }

    return res.status(200).json(order);
  }

  public static async getAll(req: Request, res: Response) {
    const orderRepository = OrderController.getRepository();

    const orders = await orderRepository.find({
      where: { user: { id: req.user.id } },
      order: { id: 'DESC' },
    });

    return res.status(200).json(orders);
  }
}

export default OrderController;
