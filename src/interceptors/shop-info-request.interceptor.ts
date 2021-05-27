import { NextFunction, Request, Response } from 'express';
import unprocessableEntity from '../errors/http/unprocessable-entity.error';
import { HandlerReturn } from '../types/middlewares/interceptors/handler-return.types';

export class ShopInfoRequestInterceptor {
  public static handler(req: Request): HandlerReturn {
    return {
      success: true,
    };
  }

  public static create(req: Request, res: Response, next: NextFunction) {
    const handled = ShopInfoRequestInterceptor.handler(req);

    if (!handled.success)
      return unprocessableEntity({ message: handled.message }).send(res);

    next();
  }

  public static update(req: Request, res: Response, next: NextFunction) {
    const handled = ShopInfoRequestInterceptor.handler(req);

    req.interceptor.id = 1;

    if (!handled.success)
      return unprocessableEntity({ message: handled.message }).send(res);

    next();
  }
}
