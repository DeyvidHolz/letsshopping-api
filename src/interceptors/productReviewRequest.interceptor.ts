import { NextFunction, Request, Response } from 'express';
import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import { handlerReturn } from '../types/middlewares/interceptors/handlerReturn.types';

export class ProductReviewRequestInterceptor {
  public static handler(req: Request): handlerReturn {
    return {
      success: true,
    };
  }

  public static create(req: Request, res: Response, next: NextFunction) {
    const handled = ProductReviewRequestInterceptor.handler(req);

    req.interceptor.product = { code: req.params.productCode };

    if (!handled.success)
      return unprocessableEntity({ message: handled.message }).send(res);

    next();
  }

  public static update(req: Request, res: Response, next: NextFunction) {
    const handled = ProductReviewRequestInterceptor.handler(req);

    if (!handled.success)
      return unprocessableEntity({ message: handled.message }).send(res);

    next();
  }
}
