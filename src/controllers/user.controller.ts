import jwt from 'jsonwebtoken'
import jwt_decode from 'jwt-decode'

import jwtConfig from '../config/jwt.config'

import { connection } from '../../server';
import { User } from '../entity/User';

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
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.username = data.username;
    user.password = data.password;
    user.email = data.email;
    user.birthDate = data.birthDate;
    
    const userRepository = await connection.getRepository(User);
    await userRepository.save(user);

    if (user) {
      return res.status(201).json({ error: false, message: 'User created' })
    }
  
    return res.status(422).json({ error: true, message: 'An error occurred while attempting to create user' })
  }

  public static getAll = async (req, res) => {
    const userRepository = await connection.getRepository(User);
    const users = await userRepository.find();
    return res.json(users)
  }

  public static get = async (req, res) => {
    const userRepository = await connection.getRepository(User);
    const user = await userRepository.findOne({ email: req.query.email });
    return res.json(user)
  }

  public static auth = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(422).json({ error: true, message: 'Invalid username or password' })
    }

    const userRepository = await connection.getRepository(User);

    let user = await userRepository.findOne({ username });

    if (!user) return res.status(401).json({ error: true, message: 'User not found' })

    if (user.password === password) {
      let payload = { id: user.id, name: user.firstName, email: user.email }
      let token = jwt.sign(payload, jwtConfig.secretOrKey, { expiresIn: 10000000 })
      
      return res.json({ error: false, message: token })
    }

    return res.status(401).json({ error: true, message: 'Invalid username or password' })

  }

}

export default UserController