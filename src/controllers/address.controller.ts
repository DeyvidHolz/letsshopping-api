import { getConnection, Not } from 'typeorm';
import { Request, Response } from 'express';
import unprocessableEntity from '../errors/http/unprocessable-entity.error';
import internalServerError from '../errors/http/internal-server.error';
import notFound from '../errors/http/not-found.error';
import { Address } from '../entities/address.entity';
import { User } from '../entities/user.entity';
import {
  GetAddressDto,
  CreateAddressDto,
  DeleteAddressDto,
  UpdateAddressDto,
} from '../dtos/address.dto';
import { getMessage } from '../helpers/messages.helper';
import addressMessages from '../messages/address.messages';
import { Logger } from '../helpers/logger.helper';

class AddressController {
  private static getRepository() {
    return getConnection().getRepository(Address);
  }

  public static async create(req: Request, res: Response) {
    const addressRepository = AddressController.getRepository();
    const dto: CreateAddressDto = req.dto;

    const address = addressRepository.create(dto as Address);
    address.user = req.user as User;

    try {
      /**
       * TODO: select all addresses (not just the main), so that
       * it won't need to query again for addressWithSamezipCode
       */
      const addresses = await addressRepository.find({
        where: {
          isMain: true,
          user: { id: req.user.id },
        },
      });

      /**
       * Checking for duplicated zipCodes.
       */
      // TODO: remove this query
      const addressWithSamezipCode = await addressRepository.findOne({
        where: { zipCode: dto.zipCode, user: { id: req.user.id } },
      });

      if (addressWithSamezipCode) {
        return unprocessableEntity({
          message: getMessage(addressMessages.duplicatedZipCode, {
            zipCode: dto.zipCode,
          }),
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
      Logger.critical(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async get(req: Request, res: Response) {
    const addressRepository = AddressController.getRepository();
    const dto: GetAddressDto = req.dto;

    const address = await addressRepository.findOne({
      id: dto.id,
      user: { id: req.user.id },
    });

    if (!address) return notFound({ message: 'Address not found' }).send(res);

    return res.status(200).json(address);
  }

  public static async getAll(req: Request, res: Response) {
    const addressRepository = AddressController.getRepository();

    const addresses = await addressRepository.find({
      where: {
        user: { id: req.user.id },
      },
      order: { id: 'DESC' },
    });
    return res.status(200).json(addresses);
  }

  public static async update(req: Request, res: Response) {
    const addressRepository = AddressController.getRepository();
    const dto: UpdateAddressDto = req.dto;
    const address = addressRepository.create(dto as Address);
    address.user = req.user;

    const addresses = await addressRepository.find({
      where: {
        id: Not(address.id),
        user: { id: req.user.id },
      },
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
        message: getMessage(addressMessages.updated, address),
        address,
      });
    } catch (err) {
      Logger.critical(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async delete(req: Request, res: Response) {
    const addressRepository = AddressController.getRepository();
    const dto: DeleteAddressDto = req.dto;

    const address = await addressRepository.findOne({
      id: dto.id,
      user: { id: req.user.id },
    });

    /**
     * If the main address is being deleted, we should set a new one
     * as main address.
     */
    if (address && address.isMain) {
      const addresses = await addressRepository.find({
        where: { id: Not(dto.id), user: { id: req.user.id } },
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
      await addressRepository.delete(dto.id);

      return res
        .status(200)
        .json({ message: getMessage(addressMessages.deleted) });
    } catch (err) {
      Logger.critical(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }
}

export default AddressController;
