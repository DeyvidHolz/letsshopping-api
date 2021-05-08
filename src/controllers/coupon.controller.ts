import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import { Coupon } from '../entities/Coupon.entity';
import { CreateCouponDto, UpdateCouponDto } from '../dto/coupon.dto';
import { getMessage } from '../helpers/messages.helper';
import couponMessages from '../messages/coupon.messages';
import CouponValidator from '../validators/coupon.validator';

class CouponController {
  private static getRepository() {
    return getConnection().getRepository(Coupon);
  }

  public static async create(req: Request, res: Response) {
    const couponRepository = CouponController.getRepository();
    const coupon = couponRepository.create(req.dto as Coupon);

    try {
      await couponRepository.save(coupon);
      return res
        .status(201)
        .json({ message: getMessage(couponMessages.created, coupon), coupon });
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
    const couponRepository = CouponController.getRepository();
    const couponId: number = Number(req.params.id);
    const coupon = await couponRepository.findOne(couponId);

    if (!coupon) {
      return notFound({
        message: getMessage(couponMessages.notFound, { id: couponId }),
      }).send(res);
    }

    return res.status(200).json(coupon);
  }

  public static async getAll(req: Request, res: Response) {
    const couponRepository = CouponController.getRepository();

    const coupon = await couponRepository.find();
    return res.status(200).json(coupon);
  }

  public static async update(req: Request, res: Response) {
    const couponRepository = CouponController.getRepository();
    const couponId: number = Number(req.params.id);

    if (!couponId || isNaN(couponId)) {
      return unprocessableEntity({
        message: getMessage(couponMessages.invalidId, { id: couponId }),
      }).send(res);
    }

    // TODO: query category instead of just use .create, then update data.
    const coupon = couponRepository.create(req.dto as Coupon);

    try {
      await couponRepository.save(coupon);
      return res
        .status(200)
        .json({ message: getMessage(couponMessages.updated, coupon), coupon });
    } catch (err) {
      console.log(err);

      if (err.code === '23505') {
        return unprocessableEntity({
          message: getMessage(couponMessages.duplicatedCode, coupon),
        }).send(res);
      }

      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async delete(req: Request, res: Response) {
    const couponRepository = CouponController.getRepository();

    try {
      await couponRepository.delete(Number(req.params.id));
      return res
        .status(200)
        .json({ message: getMessage(couponMessages.deleted) });
    } catch (err) {
      console.log(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }
}

export default CouponController;
