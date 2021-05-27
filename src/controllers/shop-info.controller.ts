import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import internalServerError from '../errors/http/internal-server.error';
import { ShopInfo } from '../entities/shop-info.entity';
import { getMessage } from '../helpers/messages.helper';
import shopInfoMessages from '../messages/shop-info.messages';
import { Logger } from '../helpers/logger.helper';

class ShopInfoController {
  private static getRepository() {
    return getConnection().getRepository(ShopInfo);
  }

  public static async create(req: Request, res: Response) {
    const shopInfoRepository = ShopInfoController.getRepository();
    const shopInfo = shopInfoRepository.create(req.dto as ShopInfo);

    try {
      await shopInfoRepository.save(shopInfo);
      return res.status(201).json({
        message: getMessage(shopInfoMessages.created, shopInfo),
        shopInfo,
      });
    } catch (err) {
      Logger.critical(err);
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
    const shopInfo = shopInfoRepository.create(req.dto as ShopInfo);

    try {
      await shopInfoRepository.save(shopInfo);
      return res.status(200).json({
        message: getMessage(shopInfoMessages.updated, shopInfo),
        shopInfo,
      });
    } catch (err) {
      Logger.critical(err);

      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }
}

export default ShopInfoController;
