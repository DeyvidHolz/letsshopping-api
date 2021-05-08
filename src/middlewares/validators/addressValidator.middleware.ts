import { NextFunction, Request, Response } from 'express';

import { CreateAddressDto, UpdateAddressDto } from '../../dto/address.dto';
import AddressValidator from '../../validators/address.validator';
import ValidatorMiddleware from './validatorMiddleware';

class AddressValidatorMiddleware extends ValidatorMiddleware {
  public static create(req: Request, res: Response, next: NextFunction) {
    const dto: CreateAddressDto = {
      country: req.body.country,
      zipCode: req.body.zipCode,
      state: req.body.state,
      neighbourhood: req.body.neighbourhood,
      street: req.body.street,
      number: req.body.number,
      isMain: req.body.isMain || false,
    };

    const validation = new AddressValidator(dto);
    AddressValidatorMiddleware.validate({ dto, validation, req, res, next });
  }

  public static update(req: Request, res: Response, next: NextFunction) {
    const dto: UpdateAddressDto = {
      country: req.body.country,
      zipCode: req.body.zipCode,
      state: req.body.state,
      neighbourhood: req.body.neighbourhood,
      street: req.body.street,
      number: req.body.number,
      isMain: req.body.isMain || false,
    };

    const validation = new AddressValidator(dto, true);
    AddressValidatorMiddleware.validate({ dto, validation, req, res, next });
  }
}

export default AddressValidatorMiddleware;
