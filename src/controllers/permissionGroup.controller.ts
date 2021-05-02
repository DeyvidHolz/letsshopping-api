import { getConnection, Raw } from 'typeorm';
import { Request, Response } from 'express';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import {
  createPermissionGroupPayload,
  updatePermissionGroupPayload,
} from '../types/controllers/permissionGroup.types';
import { getMessage } from '../helpers/messages.helper';
import { PermissionGroup } from '../entities/PermissionGroup.entity';
import PermissionGroupValidator from '../validators/permissionGroup.validator';
import permissionGroupMessages from '../messages/permissionGroup.messages';
import { User } from '../entities/User.entity';

class PermissionGroupController {
  private static getRepository() {
    return getConnection().getRepository(PermissionGroup);
  }

  public static async create(req: Request, res: Response) {
    const permissionGroupRepository = PermissionGroupController.getRepository();
    const data: createPermissionGroupPayload = {
      name: req.body.name,
      level: req.body.level,
    };

    const permissionGroup = permissionGroupRepository.create(
      data as PermissionGroup,
    );

    const validation = new PermissionGroupValidator(permissionGroup);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: validation.first(),
        errors: validation.validationErrors,
      }).send(res);
    }

    try {
      await permissionGroupRepository.save(permissionGroup);
      return res.status(201).json({
        message: getMessage(permissionGroupMessages.created, permissionGroup),
        permissionGroup,
      });
    } catch (err) {
      console.log(err);

      if (err.code === '23505') {
        return unprocessableEntity({
          message: getMessage(
            permissionGroupMessages.alreadyInUse,
            permissionGroup,
          ),
        }).send(res);
      }

      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async update(req: Request, res: Response) {
    const permissionGroupRepository = PermissionGroupController.getRepository();
    const permissionGroupName: string = req.params.name;

    if (!permissionGroupName) {
      return unprocessableEntity({
        message: getMessage(permissionGroupMessages.invalidId, {
          name: permissionGroupName,
        }),
      }).send(res);
    }

    const data: updatePermissionGroupPayload = {
      name: permissionGroupName,
      level: req.body.level,
    };

    // @todo: find by name then update
    const permissionGroup = permissionGroupRepository.create(
      data as PermissionGroup,
    );

    const validation = new PermissionGroupValidator(permissionGroup);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: validation.first(),
        errors: validation.validationErrors,
      }).send(res);
    }

    try {
      await permissionGroupRepository.save(permissionGroup);
      return res.status(200).json({
        message: getMessage(permissionGroupMessages.updated, permissionGroup),
        permissionGroup,
      });
    } catch (err) {
      console.log(err);

      if (err.code === '23505') {
        return unprocessableEntity({
          message: getMessage(
            permissionGroupMessages.alreadyInUse,
            permissionGroup,
          ),
        }).send(res);
      }

      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async get(req: Request, res: Response) {
    const permissionGroupRepository = PermissionGroupController.getRepository();
    const permissionGroup = await permissionGroupRepository.findOne({
      name: req.params.name,
    });

    if (!permissionGroup) {
      return notFound({
        message: getMessage(permissionGroupMessages.notFound, {
          name: req.params.name,
        }),
      }).send(res);
    }

    return res.status(200).json(permissionGroup);
  }

  public static async getAll(req: Request, res: Response) {
    const permissionGroupRepository = PermissionGroupController.getRepository();

    const permissionGroup = await permissionGroupRepository.find();
    return res.status(200).json(permissionGroup);
  }

  public static async delete(req: Request, res: Response) {
    const permissionGroupRepository = PermissionGroupController.getRepository();

    if (!req.params.name)
      return unprocessableEntity({ message: "Param 'name' is required. " });

    if (req.params.name === process.env.DEFAULT_PERMISSION_GROUP)
      return unprocessableEntity({
        message: getMessage(permissionGroupMessages.noPermissionToDelete, {
          name: req.params.name,
        }),
      });

    try {
      await permissionGroupRepository.delete({ name: req.params.name });
      return res
        .status(200)
        .json({ message: getMessage(permissionGroupMessages.deleted) });
    } catch (err) {
      console.log(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async setUserPermissionGroup(req: Request, res: Response) {
    const permissionGroupRepository = PermissionGroupController.getRepository();
    const userRepository = getConnection().getRepository(User);

    // Checking data
    const permissionGroupName: string = req.params.name;
    const userId: number = Number(req.params.userId);

    if (isNaN(userId))
      return unprocessableEntity({ message: 'Invalid user ID.' }).send(res);
    if (!permissionGroupName)
      return unprocessableEntity({ message: 'Invalid group name.' });

    // Checking if permissionGroup and user exists
    const permissionGroup = await permissionGroupRepository.findOne({
      name: Raw(
        (alias) => `LOWER(${alias}) Like LOWER('%${permissionGroupName}%')`,
      ),
    });
    const user = await userRepository.findOne(userId);

    if (!permissionGroup)
      return notFound({
        message: `Group with name ${permissionGroupName} not found.`,
      }).send(res);
    if (!user)
      return notFound({ message: `User with ID ${userId} not found.` }).send(
        res,
      );

    // Changing user's permission group
    user.permissionGroup = permissionGroup;
    await userRepository.save(user);

    delete user.password;
    return res.json({ message: 'Permission group changed.', user });
  }
}

export default PermissionGroupController;
