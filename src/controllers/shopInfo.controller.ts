import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import internalServerError from '../errors/http/internalServer.error';
import { ShopInfo } from '../entities/ShopInfo.entity';
import {
  createShopInfoPayload,
  updateShopInfoPayload,
} from '../types/controllers/shopInfo.types';
import { getMessage } from '../helpers/messages.helper';
import shopInfoMessages from '../messages/shopInfo.messages';
import ShopInfoValidator from '../validators/shopInfo.validator';
import unprocessableEntity from '../errors/http/unprocessableEntity.error';

class ShopInfoController {
  private static getRepository() {
    return getConnection().getRepository(ShopInfo);
  }

  public static async create(req: Request, res: Response) {
    const shopInfoRepository = ShopInfoController.getRepository();

    const data: createShopInfoPayload = {
      name: req.body.name,
      phones: req.body.phones,
      emails: req.body.emails,
      socials: req.body.socials,
    };

    const shopInfo = shopInfoRepository.create((data as unknown) as ShopInfo);

    const validation = new ShopInfoValidator(shopInfo);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: validation.first(),
        errors: validation.validationErrors,
      }).send(res);
    }

    try {
      await shopInfoRepository.save(shopInfo);
      return res.status(201).json({
        message: getMessage(shopInfoMessages.created, shopInfo),
        shopInfo,
      });
    } catch (err) {
      console.log(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async get(req: Request, res: Response) {
    const shopInfoRepository = ShopInfoController.getRepository();
    const shopInfo = await shopInfoRepository.findOne(1);

    if (!shopInfo) {
      const newShopInfo = new ShopInfo();
      newShopInfo.name = process.env.SHOP_NAME;
      await shopInfoRepository.save(shopInfo);
    }

    return res.status(200).json(shopInfo);
  }

  public static async update(req: Request, res: Response) {
    const shopInfoRepository = ShopInfoController.getRepository();
    req.body.id = 1;

    const data: updateShopInfoPayload = {
      id: req.body.id,
      name: req.body.name,
      phones: req.body.phones,
      emails: req.body.emails,
      socials: req.body.socials,
    };

    const shopInfo = shopInfoRepository.create((data as unknown) as ShopInfo);

    const validation = new ShopInfoValidator(shopInfo);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: validation.first(),
        errors: validation.validationErrors,
      }).send(res);
    }

    try {
      await shopInfoRepository.save(shopInfo);
      return res.status(201).json({
        message: getMessage(shopInfoMessages.updated, shopInfo),
        shopInfo,
      });
    } catch (err) {
      console.log(err);

      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }
}

export default ShopInfoController;
