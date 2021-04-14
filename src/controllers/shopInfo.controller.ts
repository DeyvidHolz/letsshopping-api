import { getConnection } from 'typeorm';
import { Request, Response } from 'express';
import decode from 'jwt-decode';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import unauthorized from '../errors/http/unauthorized';
import { Coupon } from '../entity/Coupon';
import { ShopInfo } from '../entity/ShopInfo';

class ShopInfoController {
  private static getRespository() {
    return getConnection().getRepository(ShopInfo);
  }

  public static async create(req: Request, res: Response) {
    const shopInfoRepository = ShopInfoController.getRespository();
    const shopInfo = shopInfoRepository.create(req.body as ShopInfo);

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
    const shopInfoRepository = ShopInfoController.getRespository();
    const shopInfo = await shopInfoRepository.findOne(1);

    if (!shopInfo) {
      // @TODO: create shop info and query again.
      return notFound({
        message: 'Shop info not found.',
      }).send(res);
    }

    return res.status(200).json(shopInfo);
  }

  public static async update(req: Request, res: Response) {
    const shopInfoRepository = ShopInfoController.getRespository();
    req.body.id = 1;
    const shopInfo = shopInfoRepository.create(req.body as ShopInfo);

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
