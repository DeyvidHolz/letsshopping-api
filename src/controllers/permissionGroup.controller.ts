import { getConnection, Raw } from 'typeorm';
import { Request, Response } from 'express';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import { getMessage } from '../helpers/messages.helper';
import { PermissionGroup } from '../entities/PermissionGroup.entity';
import permissionGroupMessages from '../messages/permissionGroup.messages';
import { User } from '../entities/User.entity';

class PermissionGroupController {
  private static getRepository() {
    return getConnection().getRepository(PermissionGroup);
  }

  public static async create(req: Request, res: Response) {
    const permissionGroupRepository = PermissionGroupController.getRepository();

    const permissionGroup = permissionGroupRepository.create(
      req.dto as PermissionGroup,
    );

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

    // TODO: find by name then update
    const permissionGroup = permissionGroupRepository.create(
      req.dto as PermissionGroup,
    );

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
    const permissionGroupName: string = req.params.name;

    const permissionGroup = await permissionGroupRepository.findOne({
      name: permissionGroupName,
    });

    if (!permissionGroup) {
      return notFound({
        message: getMessage(permissionGroupMessages.notFound, {
          name: permissionGroupName,
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
    const permissionGroupName: string = req.params.name;

    if (!permissionGroupName)
      return unprocessableEntity({ message: "Param 'name' is required. " });

    if (permissionGroupName === process.env.DEFAULT_PERMISSION_GROUP)
      return unprocessableEntity({
        message: getMessage(permissionGroupMessages.noPermissionToDelete, {
          name: permissionGroupName,
        }),
      });

    try {
      await permissionGroupRepository.delete({ name: permissionGroupName });
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
    const permissionGroupName: string = req.params.name;

    // Checking data
    const userId: number = Number(req.params.userId);

    // TODO: create middleware to do this kind of stuff.
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
