import { getConnection } from 'typeorm';
import { Request, Response } from 'express';
import decode from 'jwt-decode';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import unauthorized from '../errors/http/unauthorized';
import { Coupon } from '../entity/Coupon';

class CouponController {
  private static getRespository() {
    return getConnection().getRepository(Coupon);
  }

  public static async create(req: Request, res: Response) {
    const couponRepository = CouponController.getRespository();
    const coupon = couponRepository.create(req.body as Coupon);

    // let user: User;

    // try {
    //   user = decode(req.headers.authorization) as User;
    // } catch (err) {
    //   return unauthorized({
    //     message: 'Invalid authentication token.',
    //   }).send(res);
    // }

    try {
      await couponRepository.save(coupon);
      return res.status(201).json({ message: 'Coupon created.', coupon });
    } catch (err) {
      console.log(err);

      if (err.code === '23505') {
        return unprocessableEntity({
          message: 'This coupon code is already in use.',
        }).send(res);
      }

      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async get(req: Request, res: Response) {
    const couponRepository = CouponController.getRespository();
    const coupon = await couponRepository.findOne(req.params.id);

    if (!coupon) {
      return notFound({
        message: 'Coupon not found.',
      }).send(res);
    }

    return res.status(200).json(coupon);
  }

  public static async getAll(req: Request, res: Response) {
    const couponRepository = CouponController.getRespository();

    // @TODO: remove and put to a function (helper)
    // let user: User;

    // try {
    //   user = decode(req.headers.authorization) as User;
    // } catch (err) {
    //   return unauthorized({
    //     message: 'Invalid authentication token.',
    //   });
    // }

    const coupon = await couponRepository.find();
    return res.status(200).json(coupon);
  }

  public static async update(req: Request, res: Response) {
    const couponRepository = CouponController.getRespository();
    const coupon = couponRepository.create(req.body as Coupon);

    if (!req.body.id) {
      return unprocessableEntity({
        message: 'Invalid address ID.',
      }).send(res);
    }

    // let user: User;
    // try {
    //   user = decode(req.headers.authorization) as User;
    // } catch (err) {
    //   return unauthorized({
    //     message: 'Invalid authentication token.',
    //   });
    // }

    try {
      await couponRepository.save(coupon);
      return res.status(201).json({ message: 'Coupon updated.', coupon });
    } catch (err) {
      console.log(err);

      if (err.code === '23505') {
        return unprocessableEntity({
          message: 'This coupon code is already in use.',
        }).send(res);
      }

      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async delete(req: Request, res: Response) {
    const couponRepository = CouponController.getRespository();
    try {
      await couponRepository.delete(req.params.id);
      return res.status(200).json({ message: 'Coupon deleted.' });
    } catch (err) {
      console.log(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }
}

export default CouponController;
