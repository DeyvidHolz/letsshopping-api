import { NextFunction, Request, Response } from 'express';
import unprocessableEntity from '../errors/http/unprocessable-entity.error';
import StringHelper from '../helpers/string.helper';
import { HandlerReturn } from '../types/middlewares/interceptors/handler-return.types';

export class UserRequestInterceptor {
  public static handler(req: Request): HandlerReturn {
    if (req.body.firstName) {
      req.interceptor.firstName = StringHelper.uppercaseFirst(
        req.body.firstName,
      );
    }

    if (req.body.lastName) {
      req.interceptor.lastName = StringHelper.uppercaseFirst(req.body.lastName);
    }

    return {
      success: true,
    };
  }

  public static create(req: Request, res: Response, next: NextFunction) {
    const handled = UserRequestInterceptor.handler(req);

    if (!handled.success)
      return unprocessableEntity({ message: handled.message }).send(res);

    next();
  }

  public static update(req: Request, res: Response, next: NextFunction) {
    const handled = UserRequestInterceptor.handler(req);

    if (!handled.success)
      return unprocessableEntity({ message: handled.message }).send(res);

    next();
  }
}
