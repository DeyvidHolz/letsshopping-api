import jwt from 'jsonwebtoken'
// import jwt_decode from 'jwt-decode'
import { Request, Response } from 'express';
import { getConnection  } from 'typeorm';

import jwtConfig from '../config/jwt.config'

import { User } from '../entity/User';

import CryptHelper from '../helpers/crypt.helper';
import StringHelper from '../helpers/string.helper';
import UserValidator from '../validators/user.validator';
import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';

class UserController {
  
  public static create = async (req, res) => {
    const data = {
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      birthDate: req.body.birthDate,
    }

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
        message: 'Invalid data.',
        errors: validation.validationErrors
      })
      .send(res);
    }
    
    const userRepository = await getConnection().getRepository(User);

    try {
      await userRepository.save(user);

      if (user.id) {
        delete user.password;
        return res.status(201).json({ message: 'User created', user });
      }

    } catch (err) {

      if (err.code === '23505') {
        return unprocessableEntity({
          message: 'This username is already in use.',
          errors: validation.validationErrors
        })
        .send(res);
      }
      
      return internalServerError({ message: err.message })
        .send(res);
    }
  
  }

  public static getAll = async (req: Request, res: Response) => {
    const userRepository = await getConnection().getRepository(User);
    const users = await userRepository.find();
    return res.json(users)
  }

  public static get = async (req, res) => {
    const userRepository = await getConnection().getRepository(User);

    if (!req.query.email) 
      return unprocessableEntity({
        message: 'Invalid email.',
      })
      .send(res);

    const user = await userRepository.findOne({ email: req.query.email });
    return res.json(user);
  }

  public static auth = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
      return unprocessableEntity({
        message: 'Invalid username or password.',
      })
      .send(res);
    }

    const userRepository = await getConnection().getRepository(User);

    let user = await userRepository.findOne({ username });

    if (!user) 
      return unprocessableEntity({
        message: 'Invalid username or password.',
      })
      .send(res);

    if (CryptHelper.checkPassword(password, user.password)) {
      let payload = { id: user.id, name: user.firstName, email: user.email }
      let token = jwt.sign(payload, jwtConfig.secretOrKey, { expiresIn: 10000000 })
      
      delete user.password;
      return res.json({ message: token, user });
    }

    return unprocessableEntity({
      message: 'Invalid username or password.',
    })
    .send(res);

  }

}

export default UserController;
