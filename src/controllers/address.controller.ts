import { getConnection } from 'typeorm';
import { Request, Response } from 'express';
import decode from 'jwt-decode';

import { Product } from '../entity/Product';
import { Category } from '../entity/Category';
import ProductValidator from '../validators/product.validator';
import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import { getMessage } from '../helpers/messages.helper';
import productMessages from '../messages/product.messages';
import { ProductOption } from '../entity/ProductOption';
import { ProductOptionValue } from '../entity/ProductOptionValue';
import { ProductImage } from '../entity/ProductImage';
import { Address } from '../entity/Address';
import { User } from '../entity/User';
import unauthorized from '../errors/http/unauthorized';
import { getUserData } from '../helpers/auth.helper';

class AddressController {
  private static getRespository() {
    return getConnection().getRepository(Address);
  }

  public static async create(req: Request, res: Response) {
    const addressRepository = AddressController.getRespository();
    const address = addressRepository.create(req.body as Address);

    let user: User | null = getUserData(req.headers.authorization);

    if (!user) {
      return unauthorized({
        message: 'Invalid authentication token.',
      }).send(res);
    }

    address.user = user;

    try {
      await addressRepository.save(address);
      return res.status(201).json({ message: 'Address created.', address });
    } catch (err) {
      console.log(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async get(req: Request, res: Response) {
    const addressRepository = AddressController.getRespository();

    let user: User | null = getUserData(req.headers.authorization);

    if (!user) {
      return unauthorized({
        message: 'Invalid authentication token.',
      }).send(res);
    }

    const addressId: number = (req.params.id as unknown) as number;
    const address = await addressRepository.findOne({
      id: addressId,
      user: { id: user.id },
    });

    if (!address) return notFound({ message: 'Address not found' }).send(res);

    return res.status(200).json(address);
  }

  public static async getAll(req: Request, res: Response) {
    const addressRepository = AddressController.getRespository();

    let user: User | null = getUserData(req.headers.authorization);

    if (!user) {
      return unauthorized({
        message: 'Invalid authentication token.',
      }).send(res);
    }

    const addresses = await addressRepository.find({ user: { id: user.id } });
    return res.status(200).json(addresses);
  }

  public static async update(req: Request, res: Response) {
    const addressRepository = AddressController.getRespository();
    const address = addressRepository.create(req.body as Address);

    if (!req.body.id) {
      return unprocessableEntity({
        message: 'Invalid address ID.',
      }).send(res);
    }

    let user: User | null = getUserData(req.headers.authorization);

    if (!user) {
      return unauthorized({
        message: 'Invalid authentication token.',
      }).send(res);
    }

    address.user = user;

    try {
      await addressRepository.save(address);
      return res.status(201).json({ message: 'Address updated.', address });
    } catch (err) {
      console.log(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async delete(req: Request, res: Response) {
    const addressRepository = AddressController.getRespository();
    try {
      await addressRepository.delete(req.params.id);
      return res.status(200).json({ message: 'Address deleted.' });
    } catch (err) {
      console.log(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }
}

export default AddressController;
