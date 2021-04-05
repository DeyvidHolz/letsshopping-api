import jwt from 'jsonwebtoken'
// import jwt_decode from 'jwt-decode'
import { Request, Response } from 'express';
import { getConnection  } from 'typeorm';

import jwtConfig from '../config/jwt.config'

import { User } from '../entity/User';

import CryptHelper from '../helpers/crypt.helper';
import StringHelper from '../helpers/string.helper';
import validator from 'validator';

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

    const validationErrors = [];

    if (!data.username.match(/[\w\.]+/g)) {
      validationErrors.push({ field: 'username', message: 'Invalid username.'});
    }

    if (!(data.password.length > 5 && data.password.length < 100)) {
      validationErrors.push({ field: 'passwrd', message: 'Invalid password.', tip: 'Password length must be between 6-99 characters.'});
    }

    if (!validator.isAlpha(data.firstName)) {
      validationErrors.push({ field: 'firstName', message: 'Invalid first name.'});
    }

    if (!data.lastName.match(/^[A-Za-z]+$/)) {
      validationErrors.push({ field: 'lastName', message: 'Invalid last name.'});
    }

    if (!validator.isEmail(data.email)) {
      validationErrors.push({ field: 'email', message: 'Invalid email.'});
    }

    if (!validator.isDate(data.birthDate)) {
      validationErrors.push({ field: 'birthDate', message: 'Invalid birth date.', tip: 'Birth date format must be YYYY-MM-DD.'});
    }

    if (validationErrors.length) {
      return res.status(422).json({ error: true, message: 'Invalid data.', errors: validationErrors }); 
    }

    const user = new User();
    user.firstName = StringHelper.uppercaseFirst(data.firstName);
    user.lastName = StringHelper.uppercaseFirst(data.lastName);
    user.username = data.username;
    user.password = CryptHelper.encryptPassword(data.password);
    user.email = data.email;
    user.birthDate = data.birthDate;
    
    const userRepository = await getConnection().getRepository(User);

    try {
      await userRepository.save(user);

      if (user.id) {
        delete user.password;
        return res.status(201).json({ message: 'User created', user });
      }

    } catch (err) {

      if (err.code === '23505') {
        return res.status(422).json({ error: true, message: 'This username is already in use.' }); 
      }
      return res.status(500).json({ error: true, message: err });  

    }
  
    return res.status(400).json({ error: true, message: 'An error occurred while attempting to create user' })
  }

  public static getAll = async (req: Request, res: Response) => {
    const userRepository = await getConnection().getRepository(User);
    const users = await userRepository.find();
    return res.json(users)
  }

  public static get = async (req, res) => {
    const userRepository = await getConnection().getRepository(User);

    if (!req.query.email) 
      return res.status(422).json({ error: true, message: 'Invalid email' });

    const user = await userRepository.findOne({ email: req.query.email });
    return res.json(user);
  }

  public static auth = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(422).json({ error: true, message: 'Invalid username or password' })
    }

    const userRepository = await getConnection().getRepository(User);

    let user = await userRepository.findOne({ username });

    if (!user) return res.status(401).json({ error: true, message: 'User not found' })

    if (CryptHelper.checkPassword(password, user.password)) {
      let payload = { id: user.id, name: user.firstName, email: user.email }
      let token = jwt.sign(payload, jwtConfig.secretOrKey, { expiresIn: 10000000 })
      
      delete user.password;
      return res.json({ message: token, user });
    }

    return res.status(401).json({ error: true, message: 'Invalid username or password' })

  }

}

export default UserController;
