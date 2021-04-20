import jwt from 'jsonwebtoken';
// import jwt_decode from 'jwt-decode'
import { Request, Response } from 'express';
import { getConnection, Raw } from 'typeorm';
import decode from 'jwt-decode';

import jwtConfig from '../config/jwt.config';

import { User } from '../entity/User';

import CryptHelper from '../helpers/crypt.helper';
import StringHelper from '../helpers/string.helper';
import UserValidator from '../validators/user.validator';
import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import userMessages from '../messages/user.messages';
import { getMessage } from '../helpers/messages.helper';
import { Cart } from '../entity/Cart';

class UserController {
  private static getRespository() {
    return getConnection().getRepository(User);
  }

  public static async create(req: Request, res: Response) {
    const data = {
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      birthDate: req.body.birthDate,
    };

    const user = new User();
    user.firstName = StringHelper.uppercaseFirst(data.firstName);
    user.lastName = StringHelper.uppercaseFirst(data.lastName);
    user.username = data.username;
    user.password = CryptHelper.encryptPassword(data.password);
    user.email = data.email;
    user.birthDate = data.birthDate;

    const validation = new UserValidator(user);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: getMessage(userMessages.invalidData, user),
        errors: validation.validationErrors,
      }).send(res);
    }

    const userRepository = await UserController.getRespository();

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
          errors: validation.validationErrors,
        }).send(res);
      }

      return internalServerError({ message: err.message }).send(res);
    }
  }

  public static async getAll(req: Request, res: Response) {
    const userRepository = await UserController.getRespository();
    const users = await userRepository.find();
    return res.json(users);
  }

  public static async get(req: Request, res: Response) {
    const userRepository = await UserController.getRespository();

    if (!req.query.email)
      return unprocessableEntity({
        message: getMessage(userMessages.invalidEmail),
      }).send(res);

    const email: string = req.query.email as string;

    const user = await userRepository.findOne({ email });

    if (!user)
      return notFound({
        message: getMessage(userMessages.searchByEmailNotFound, {
          email: req.query.email,
        }),
      }).send(res);

    return res.json(user);
  }

  public static async auth(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
      return unprocessableEntity({
        message: getMessage(userMessages.invalidCredentials),
      }).send(res);
    }

    const userRepository = await UserController.getRespository();

    let user = await userRepository.findOne({
      where: { username },
      relations: ['cart'],
    });

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

    if (CryptHelper.checkPassword(password)) {
      let payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        cart_id: user.cart.id,
      };

      let token = jwt.sign(payload, jwtConfig.secretOrKey, {
        expiresIn: 10000000,
      });

      return res.json({ message: token, user });
    }

    return unprocessableEntity({
      message: getMessage(userMessages.invalidCredentials),
    }).send(res);
  }

  public static async update(req: Request, res: Response) {
    const userRepository = await UserController.getRespository();

    const userIDisEmpty = req.body.id === undefined || req.body.id === '';

    if (userIDisEmpty) {
      return unprocessableEntity({
        message: "Field 'id' is required.",
      }).send(res);
    }

    const user = await userRepository.findOne(Number(req.body.id));

    if (!user) {
      return notFound({
        message: getMessage(userMessages.searchByIDNotFound, {
          id: req.body.id,
        }),
      }).send(res);
    }

    const currentPasswordIsEmpty =
      req.body.currentPassword === undefined || req.body.currentPassword === '';

    if (currentPasswordIsEmpty) {
      return unprocessableEntity({
        message: "Field 'currentPassword' is required.",
      }).send(res);
    }

    if (!CryptHelper.checkPassword(req.body.currentPassword)) {
      return unprocessableEntity({
        message: getMessage(userMessages.invalidPassword),
      }).send(res);
    }

    const data = {
      password: req.body.password ?? user.password,
      firstName: req.body.firstName ?? user.firstName,
      lastName: req.body.lastName ?? user.lastName,
      email: req.body.email ?? user.email,
      birthDate: req.body.birthDate ?? user.birthDate,
    };

    user.firstName = StringHelper.uppercaseFirst(data.firstName);
    user.lastName = StringHelper.uppercaseFirst(data.lastName);
    user.password = CryptHelper.encryptPassword(data.password);
    user.email = data.email;
    user.birthDate = data.birthDate;

    const validation = new UserValidator(user);

    if (validation.hasErrors()) {
      return unprocessableEntity({
        message: getMessage(userMessages.invalidData),
        errors: validation.validationErrors,
      }).send(res);
    }

    try {
      if (user.id) {
        return res
          .status(200)
          .json({ message: getMessage(userMessages.updated, user), user });
      }
    } catch (err) {
      if (err.code === '23505') {
        return unprocessableEntity({
          message: getMessage(userMessages.alreadyExists, user),
          errors: validation.validationErrors,
        }).send(res);
      }

      return internalServerError({ message: err.message }).send(res);
    }
  }

  public static async delete(req: Request, res: Response) {
    try {
      const userDecoded = decode(req.headers.authorization);
      const userRepository = UserController.getRespository();

      await userRepository.delete({
        username: userDecoded['username'],
      });

      return res
        .status(200)
        .json({ message: getMessage(userMessages.deleted) });
    } catch (err) {
      return unprocessableEntity({
        message: getMessage(userMessages.alreadyDeleted),
      }).send(res);
    }
  }

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

    const users: User[] = await UserController.getRespository().find({
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
