import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import internalServerError from '../errors/http/internalServer.error';
import { ShopInfo } from '../entity/ShopInfo.entity';
import {
  createShopInfoPayload,
  updateShopInfoPayload,
} from '../types/controllers/shopInfo.types';

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

    try {
      await shopInfoRepository.save(shopInfo);
      return res.status(201).json({ message: 'Shop info created.', shopInfo });
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

    try {
      await shopInfoRepository.save(shopInfo);
      return res.status(201).json({ message: 'Shop info updated.', shopInfo });
    } catch (err) {
      console.log(err);

      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }
}

export default ShopInfoController;
