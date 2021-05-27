import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import { Coupon } from '../entities/coupon.entity';
import {
  CreateCouponDto,
  DeleteCouponDto,
  GetCouponDto,
  UpdateCouponDto,
} from '../dto/coupon.dto';
import { getMessage } from '../helpers/messages.helper';
import couponMessages from '../messages/coupon.messages';
import CouponValidator from '../validators/coupon.validator';
import { Logger } from '../helpers/logger.helper';

class CouponController {
  private static getRepository() {
    return getConnection().getRepository(Coupon);
  }

  public static async create(req: Request, res: Response) {
    const couponRepository = CouponController.getRepository();
    const dto: CreateCouponDto = req.dto;
    const coupon = couponRepository.create(dto as Coupon);

    try {
      await couponRepository.save(coupon);
      return res
        .status(201)
        .json({ message: getMessage(couponMessages.created, coupon), coupon });
    } catch (err) {
      Logger.critical(err);

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
    const dto: GetCouponDto = req.dto;
    const coupon = await couponRepository.findOne(dto.id);

    if (!coupon) {
      return notFound({
        message: getMessage(couponMessages.notFound, { id: dto.id }),
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
    const dto: UpdateCouponDto = req.dto;

    // TODO: query category instead of just use .create, then update data.
    const coupon = couponRepository.create(dto as Coupon);

    try {
      await couponRepository.save(coupon);
      return res
        .status(200)
        .json({ message: getMessage(couponMessages.updated, coupon), coupon });
    } catch (err) {
      Logger.critical(err);

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
    const dto: DeleteCouponDto = req.dto;

    try {
      await couponRepository.delete(dto.id);
      return res
        .status(200)
        .json({ message: getMessage(couponMessages.deleted) });
    } catch (err) {
      Logger.critical(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }
}

export default CouponController;
