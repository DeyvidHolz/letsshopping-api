import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import { Coupon } from '../entities/Coupon.entity';
import {
  createCouponPayload,
  updateCouponPayload,
} from '../types/controllers/coupon.types';

class CouponController {
  private static getRepository() {
    return getConnection().getRepository(Coupon);
  }

  public static async create(req: Request, res: Response) {
    const couponRepository = CouponController.getRepository();
    const data: createCouponPayload = {
      code: req.body.code,
      name: req.body.name,
      description: req.body.description,
      discountType: req.body.discountType,
      discountAmount: req.body.discountAmount,
      maxUsesPerUser: req.body.maxUsesPerUser,
      maxUsers: req.body.maxUsers,
      isActive: req.body.isActive,
      ruleMinPrice: req.body.ruleMinPrice,
    };

    const coupon = couponRepository.create(data as Coupon);

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
    const couponRepository = CouponController.getRepository();
    const coupon = await couponRepository.findOne(req.params.id);

    if (!coupon) {
      return notFound({
        message: 'Coupon not found.',
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

    if (!req.body.id) {
      return unprocessableEntity({
        message: 'Invalid address ID.',
      }).send(res);
    }

    const data: updateCouponPayload = {
      id: req.body.id,
      code: req.body.code,
      name: req.body.name,
      description: req.body.description,
      discountType: req.body.discountType,
      discountAmount: req.body.discountAmount,
      maxUsesPerUser: req.body.maxUsesPerUser,
      maxUsers: req.body.maxUsers,
      isActive: req.body.isActive,
      ruleMinPrice: req.body.ruleMinPrice,
    };

    const coupon = couponRepository.create(data as Coupon);

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
    const couponRepository = CouponController.getRepository();

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
