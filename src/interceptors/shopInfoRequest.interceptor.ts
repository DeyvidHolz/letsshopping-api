import { NextFunction, Request, Response } from 'express';
import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import { handlerReturn } from '../types/middlewares/interceptors/handlerReturn.types';

export class ShopInfoRequestInterceptor {
  public static handler(req: Request): handlerReturn {
    if (req.body.categories) {
      const invalidCategories = req.body.categories.filter(
        (categoryId) => typeof categoryId !== 'number',
      );

      if (invalidCategories.length)
        return { success: false, message: 'Invalid value for "categories".' };

      req.body.categories = req.body.categories.map((categoryId) => ({
        id: categoryId,
      }));
    }

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

    req.body.id = 1;

    if (!handled.success)
      return unprocessableEntity({ message: handled.message }).send(res);

    next();
  }
}
