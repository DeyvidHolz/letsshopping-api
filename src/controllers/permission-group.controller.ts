import { Request, Response } from 'express';
import { getConnection, Raw } from 'typeorm';
import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import { getMessage } from '../helpers/messages.helper';
import { PermissionGroup } from '../entities/permission-group.entity';
import permissionGroupMessages from '../messages/permission-group.messages';
import { User } from '../entities/user.entity';
import {
  CreatePermissionGroupDto,
  DeletePermissionGroupDto,
  GetPermissionGroupDto,
  UpdatePermissionGroupDto,
} from '../dto/permission-group.dto';
import { Logger } from '../helpers/logger.helper';

class PermissionGroupController {
  private static getRepository() {
    return getConnection().getRepository(PermissionGroup);
  }

  public static async create(req: Request, res: Response) {
    const permissionGroupRepository = PermissionGroupController.getRepository();
    const dto: CreatePermissionGroupDto = req.dto;

    const permissionGroup = permissionGroupRepository.create(
      dto as PermissionGroup,
    );

    try {
      await permissionGroupRepository.save(permissionGroup);
      return res.status(201).json({
        message: getMessage(permissionGroupMessages.created, permissionGroup),
        permissionGroup,
      });
    } catch (err) {
      Logger.critical(err);

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
    const dto: UpdatePermissionGroupDto = req.dto;

    // TODO: find by name then update
    const permissionGroup = permissionGroupRepository.create(
      dto as PermissionGroup,
    );

    try {
      await permissionGroupRepository.save(permissionGroup);
      return res.status(200).json({
        message: getMessage(permissionGroupMessages.updated, permissionGroup),
        permissionGroup,
      });
    } catch (err) {
      Logger.critical(err);

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
    const dto: GetPermissionGroupDto = req.dto;

    const permissionGroup = await permissionGroupRepository.findOne({
      name: dto.name,
    });

    if (!permissionGroup) {
      return notFound({
        message: getMessage(permissionGroupMessages.notFound, {
          name: dto.name,
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
    const dto: DeletePermissionGroupDto = req.dto;

    if (dto.name === process.env.DEFAULT_PERMISSION_GROUP) {
      return unprocessableEntity({
        message: getMessage(permissionGroupMessages.noPermissionToDelete, {
          name: dto.name,
        }),
      });
    }

    try {
      await permissionGroupRepository.delete({ name: dto.name });
      return res
        .status(200)
        .json({ message: getMessage(permissionGroupMessages.deleted) });
    } catch (err) {
      Logger.critical(err);
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

    // Checking if permissionGroup and user exists
    const permissionGroup = await permissionGroupRepository.findOne({
      name: Raw((alias) => `LOWER(${alias}) = LOWER('${permissionGroupName}')`),
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

    return res.json({ message: 'Permission group changed.', user });
  }
}

export default PermissionGroupController;
