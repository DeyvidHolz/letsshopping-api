import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt, { decode } from 'jsonwebtoken';
import { getConnection, Raw } from 'typeorm';

import jwtConfig from '../config/jwt.config';
import { User } from '../entities/user.entity';
import CryptHelper from '../helpers/crypt.helper';
import StringHelper from '../helpers/string.helper';
import unprocessableEntity from '../errors/http/unprocessable-entity.error';
import internalServerError from '../errors/http/internal-server.error';
import notFound from '../errors/http/not-found.error';
import userMessages from '../messages/user.messages';
import { getMessage } from '../helpers/messages.helper';
import { Cart } from '../entities/cart.entity';
import { PermissionGroup } from '../entities/permission-group.entity';
import { JwtUser } from '../types/controllers/user-controller.types';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

dotenv.config();

class UserController {
  private static getRepository() {
    return getConnection().getRepository(User);
  }

  public static async create(req: Request, res: Response) {
    const userRepository = UserController.getRepository();
    const user = userRepository.create(req.dto as CreateUserDto);

    // Setting user default permission group
    const defaultPermissionGroup = await getConnection()
      .getRepository(PermissionGroup)
      .findOne({ where: { name: process.env.DEFAULT_PERMISSION_GROUP } });

    user.permissionGroup = defaultPermissionGroup;

    // TODO: put this in a listener
    user.password = CryptHelper.encryptPassword(user.password);

    try {
      await userRepository.save(user);

      if (user.id) {
        delete user.password;

        return res.status(201).json({
          message: getMessage(userMessages.created, user),
          user,
        });
      }
    } catch (err) {
      if (err.code === '23505') {
        return unprocessableEntity({
          message: getMessage(userMessages.alreadyExists, user),
        }).send(res);
      }

      return internalServerError({ message: err.message }).send(res);
    }
  }

  // TODO: put this in UserAdminController
  public static async getAll(req: Request, res: Response) {
    const users = await UserController.getRepository().find({
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'birthDate',
        'createdAt',
        'updatedAt',
      ],
      order: { createdAt: 'DESC' },
      relations: ['permissionGroup'],
    });

    return res.json(users);
  }

  public static async get(req: Request, res: Response) {
    return res.json(req.user);
  }

  public static async auth(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
      return unprocessableEntity({
        message: getMessage(userMessages.invalidCredentials),
      }).send(res);
    }

    const userRepository = await UserController.getRepository();

    let user = await userRepository.findOne({
      select: [
        'id',
        'username',
        'password',
        'firstName',
        'lastName',
        'email',
        'birthDate',
      ],
      where: { username },
      relations: ['cart', 'permissionGroup'],
    });

    const hashedPassword: string = user.password;

    if (!user)
      return unprocessableEntity({
        message: getMessage(userMessages.invalidCredentials),
      }).send(res);

    // Checking if user doesn't have a cart and create one
    if (!user.cart) {
      const cart = new Cart();
      cart.user = user;
      await getConnection().getRepository(Cart).save(cart);

      user.cart = cart;
      await userRepository.save(user);

      user = await userRepository.findOne({
        where: { username },
        relations: ['cart'],
      });
    }

    if (CryptHelper.checkPassword(password, hashedPassword)) {
      let payload: JwtUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        cart: { id: user.cart.id },
        permissionGroup: {
          name: user.permissionGroup.name,
          level: user.permissionGroup.level,
        },
      };

      let token = jwt.sign(payload, jwtConfig.secretOrKey, {
        expiresIn: jwtConfig.expiration,
      });

      delete user.password;
      return res.json({ token, user });
    }

    return unprocessableEntity({
      message: getMessage(userMessages.invalidCredentials),
    }).send(res);
  }

  public static async update(req: Request, res: Response) {
    const userRepository = await UserController.getRepository();
    const data: UpdateUserDto = req.dto;

    if (data.password)
      data.password = CryptHelper.encryptPassword(data.password);

    if (
      !CryptHelper.checkPassword(req.body.currentPassword, req.user.password)
    ) {
      return unprocessableEntity({
        message: getMessage(userMessages.invalidPassword),
      }).send(res);
    }

    const user = await userRepository.create(data);

    try {
      await userRepository.save(user);

      return res
        .status(200)
        .json({ message: getMessage(userMessages.updated, user), user });
    } catch (err) {
      if (err.code === '23505') {
        return unprocessableEntity({
          message: getMessage(userMessages.alreadyExists, user),
        }).send(res);
      }

      return internalServerError({ message: err.message }).send(res);
    }
  }

  public static async delete(req: Request, res: Response) {
    const userRepository = UserController.getRepository();

    await userRepository.delete({
      id: req.user.id,
    });

    return res.status(200).json({ message: getMessage(userMessages.deleted) });
  }

  // TODO: put this in UserAdminController
  public static async search(req: Request, res: Response) {
    if (!req.query.firstName && req.query.name)
      req.query.firstName = req.query.name;

    const noSearchCriteria: boolean =
      !req.query.firstName &&
      !req.query.firstName &&
      !req.query.email &&
      !req.query.by;

    if (noSearchCriteria)
      return unprocessableEntity({ message: 'Invalid search criteria.' }).send(
        res,
      );

    const users: User[] = await UserController.getRepository().find({
      where: [
        {
          firstName: Raw(
            (alias) =>
              `LOWER(${alias}) Like LOWER('%${
                req.query.by ?? req.query.firstName
              }%')`,
          ),
        },
        {
          lastName: Raw(
            (alias) =>
              `LOWER(${alias}) Like LOWER('%${
                req.query.by ?? req.query.lastName
              }%')`,
          ),
        },
        {
          email: Raw(
            (alias) =>
              `LOWER(${alias}) Like LOWER('%${
                req.query.by ?? req.query.email
              }%')`,
          ),
        },
      ],
      order: { id: 'DESC' },
    });

    if (!users.length)
      return notFound({ message: 'No users found.' }).send(res);

    return res.status(200).json(users);
  }
}

export default UserController;
