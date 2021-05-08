import { NextFunction, Request, Response } from 'express';

import { CreateAddressDto, UpdateAddressDto } from '../../dto/address.dto';
import unprocessableEntity from '../../errors/http/unprocessableEntity.error';
import { getMessage } from '../../helpers/messages.helper';
import addressMessages from '../../messages/address.messages';
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
}

export default AddressValidatorMiddleware;
