import { getConnection, Not } from 'typeorm';
import { Request, Response } from 'express';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import { Address } from '../entities/Address.entity';
import { User } from '../entities/User.entity';
import unauthorized from '../errors/http/unauthorized';
import { getUserData } from '../helpers/auth.helper';
import {
  createAddressPayload,
  updateAddressPayload,
} from '../types/controllers/address.types';
import AddressValidator from '../validators/address.validator';
import { getMessage } from '../helpers/messages.helper';
import addressMessages from '../messages/address.messages';

class AddressController {
  private static getRepository() {
    return getConnection().getRepository(Address);
  }

  public static async create(req: Request, res: Response) {
    const addressRepository = AddressController.getRepository();
    const data: createAddressPayload = {
      country: req.body.country,
      zipCode: req.body.zipCode,
      state: req.body.state,
      neighbourhood: req.body.neighbourhood,
      street: req.body.street,
      number: req.body.number,
      isMain: req.body.isMain,
    };

    const address = addressRepository.create(data as Address);

    let user: User | null = getUserData(req.headers.authorization);

    if (!user) {
      return unauthorized({
        message: 'Invalid authentication token.',
      }).send(res);
    }

    address.user = user;

    const validation = new AddressValidator(address);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: validation.first(),
        errors: validation.validationErrors,
      }).send(res);
    }

    try {
      const addresses = await addressRepository.find({
        where: { isMain: true },
      });

      /**
       * Checking for duplicated zipCodes.
       */
      const addressWithSamezipCode = await addresses.find(
        (a) => a.zipCode === address.zipCode,
      );

      if (addressWithSamezipCode) {
        return unprocessableEntity({
          message: "There's another address with this zipCode.",
        }).send(res);
      }

      if (!addresses.length) {
        /**
         * This is the first address registered by the user. So it should be the main address.
         */
        address.isMain = true;
      } else {
        /**
         * The new address should be the main one. So we need to set isMain false
         * for all the others addresses.
         */
        addressRepository.save([
          ...addresses.map((a) => {
            a.isMain = false;
            return a;
          }),
        ]);
      }

      await addressRepository.save(address);

      return res.status(201).json({
        message: getMessage(addressMessages.created, address),
        address,
      });
    } catch (err) {
      console.log(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async get(req: Request, res: Response) {
    const addressRepository = AddressController.getRepository();

    let user: User | null = getUserData(req.headers.authorization);

    if (!user) {
      return unauthorized({
        message: 'Invalid authentication token.',
      }).send(res);
    }

    const addressId: number = (req.params.id as unknown) as number;
    const address = await addressRepository.findOne({
      id: addressId,
      user: { id: user.id },
    });

    if (!address) return notFound({ message: 'Address not found' }).send(res);

    return res.status(200).json(address);
  }

  public static async getAll(req: Request, res: Response) {
    const addressRepository = AddressController.getRepository();

    let user: User | null = getUserData(req.headers.authorization);

    if (!user) {
      return unauthorized({
        message: 'Invalid authentication token.',
      }).send(res);
    }

    const addresses = await addressRepository.find({
      where: {
        user: { id: user.id },
      },
      order: { id: 'DESC' },
    });
    return res.status(200).json(addresses);
  }

  public static async update(req: Request, res: Response) {
    const addressRepository = AddressController.getRepository();

    const data: updateAddressPayload = {
      id: req.body.id,
      country: req.body.country,
      zipCode: req.body.zipCode,
      state: req.body.state,
      neighbourhood: req.body.neighbourhood,
      street: req.body.street,
      number: req.body.number,
      isMain: req.body.isMain,
    };

    const address = addressRepository.create(data as Address);

    const validation = new AddressValidator(address);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: validation.first(),
        errors: validation.validationErrors,
      }).send(res);
    }

    if (!req.body.id) {
      return unprocessableEntity({
        message: getMessage(addressMessages.invalidId, address),
      }).send(res);
    }

    let user: User | null = getUserData(req.headers.authorization);

    if (!user) {
      return unauthorized({
        message: 'Invalid authentication token.',
      }).send(res);
    }

    address.user = user;

    const addresses = await addressRepository.find({
      where: { id: Not(address.id) },
      order: { id: 'DESC' },
    });

    /**
     * Checking for duplicated zipCodes.
     */
    const addressWithSamezipCode = await addresses.find(
      (a) => a.zipCode === address.zipCode,
    );

    if (addressWithSamezipCode) {
      return unprocessableEntity({
        message: getMessage(addressMessages.duplicatedZipCode, address),
      }).send(res);
    }

    if (address.isMain) {
      /**
       * The address which is being updated should be the only main adress.
       * Checking in order to keep that.
       */
      addressRepository.save([
        ...addresses.map((a) => {
          a.isMain = false;
          return a;
        }),
      ]);
    } else {
      /**
       * Not a main address. This address may is a Main adress
       * being updated to a non-main address.
       *
       * Checking for another main address.
       */
      if (addresses.length) {
        /**
         * Checking if there's a main address.
         * If not, then setting the last one (before this) as a main address.
         */
        const mainAddress = addresses.find((a) => a.isMain);
        if (!mainAddress) {
          const newMainAddress = addresses[0];
          newMainAddress.isMain = true;

          await addressRepository.save(newMainAddress);
        }
      } else {
        /**
         * There's no other addresses on database.
         * This address should be a main address (forced).
         */
        address.isMain = true;
      }
    }

    try {
      await addressRepository.save(address);
      return res.status(200).json({
        message: getMessage(addressMessages.created, address),
        address,
      });
    } catch (err) {
      console.log(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async delete(req: Request, res: Response) {
    const addressRepository = AddressController.getRepository();
    const address = await addressRepository.findOne(req.params.id);

    /**
     * If the main address is being deleted, we should set a new one
     * as main address.
     */
    if (address && address.isMain) {
      const addresses = await addressRepository.find({
        where: { id: Not(req.params.id) },
        order: {
          id: 'DESC',
        },
      });

      if (addresses.length) {
        const newMainAddress = addresses[0];
        newMainAddress.isMain = true;
        await addressRepository.save(newMainAddress);
      }
    }

    try {
      await addressRepository.delete(req.params.id);
      return res
        .status(200)
        .json({ message: getMessage(addressMessages.indeletedvalidId) });
    } catch (err) {
      console.log(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }
}

export default AddressController;
