import { NextFunction, request, Request, Response } from 'express';

import {
  CreateAddressDto,
  DeleteAddressDto,
  GetAddressDto,
  UpdateAddressDto,
} from '../../dtos/address.dto';
import unprocessableEntity from '../../errors/http/unprocessable-entity.error';
import { getMessage } from '../../helpers/messages.helper';
import addressMessages from '../../messages/address.messages';
import AddressValidator from '../../validators/address.validator';
import ValidatorMiddleware from './validator.middleware';

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
    const addressId: number = Number(req.params.id);

    if (!addressId || isNaN(addressId)) {
      return unprocessableEntity({
        message: getMessage(addressMessages.invalidId, { id: addressId }),
      }).send(res);
    }

    const dto: UpdateAddressDto = {
      id: addressId,
      country: req.body.country,
      zipCode: req.body.zipCode,
      state: req.body.state,
      neighbourhood: req.body.neighbourhood,
      street: req.body.street,
      number: req.body.number,
      isMain: req.body.isMain || false,
    };

    const addressIdIsEmpty = dto.id === undefined || isNaN(dto.id);

    if (addressIdIsEmpty) {
      return unprocessableEntity({
        message: "Field 'id' is required.",
      }).send(res);
    }

    const validation = new AddressValidator(dto, true);
    AddressValidatorMiddleware.validate({ dto, validation, req, res, next });
  }

  public static get(req: Request, res: Response, next: NextFunction) {
    const dto: GetAddressDto = {
      id: Number(req.params.id),
    };

    if (isNaN(dto.id) || dto.id < 1) {
      return unprocessableEntity({
        message: 'Invalid param ID.',
      }).send(res);
    }

    req.dto = dto;
    next();
  }

  public static delete(req: Request, res: Response, next: NextFunction) {
    const dto: DeleteAddressDto = {
      id: Number(req.params.id),
    };

    if (isNaN(dto.id) || dto.id < 1) {
      return unprocessableEntity({
        message: 'Invalid param ID.',
      }).send(res);
    }

    req.dto = dto;
    next();
  }
}

export default AddressValidatorMiddleware;
