import { NextFunction, Request, Response } from 'express';
import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import { HandlerReturn } from '../types/middlewares/interceptors/handlerReturn.types';

export class ProductRequestInterceptor {
  public static handler(req: Request): HandlerReturn {
    if (req.body.categories) {
      const invalidCategories = req.body.categories.filter(
        (categoryId) => typeof categoryId !== 'number',
      );

      if (invalidCategories.length)
        return { success: false, message: 'Invalid value for "categories".' };

      req.interceptor.categories = req.body.categories.map((categoryId) => ({
        id: categoryId,
      }));
    }

    return {
      success: true,
    };
  }

  public static create(req: Request, res: Response, next: NextFunction) {
    const handled = ProductRequestInterceptor.handler(req);

    if (!handled.success)
      return unprocessableEntity({ message: handled.message }).send(res);

    next();
  }

  public static update(req: Request, res: Response, next: NextFunction) {
    const handled = ProductRequestInterceptor.handler(req);

    if (!handled.success)
      return unprocessableEntity({ message: handled.message }).send(res);

    next();
  }
}
