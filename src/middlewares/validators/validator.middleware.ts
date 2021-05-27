import { NextFunction, Request, Response } from 'express';
import unprocessableEntity from '../../errors/http/unprocessable-entity.error';
import { Validator } from '../../validators/validator';

type ValidatorMiddlewareData = {
  dto: any;
  validation: Validator;
  req: Request;
  res: Response;
  next: NextFunction;
};

abstract class ValidatorMiddleware {
  public static validate(data: ValidatorMiddlewareData) {
    if (data.validation.hasErrors()) {
      return unprocessableEntity({
        message: data.validation.first(),
        errors: data.validation.validationErrors,
      }).send(data.res);
    }

    data.req.dto = data.dto;
    data.next();
  }
}

export default ValidatorMiddleware;
