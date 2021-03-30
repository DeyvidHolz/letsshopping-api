import jwt from 'jsonwebtoken'
import jwt_decode from 'jwt-decode'

import jwtConfig from '../config/jwt.config'

import User from '../models/user.model'

class UserController {
  
  public static create = async (req, res) => {
    const user = {
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      birthDate: req.body.birthDate,
    }
  
    const userCreated = await User.create(user)
  
    if (userCreated) {
      return res.status(201).json({ error: false, message: 'User created' })
    }
  
    return res.status(422).json({ error: true, message: 'An error occurred while attempt to create user' })
  }

  public static getAll = async (req, res) => {
    const users = await User.findAll()
    return res.json(users)
  }

  public static get = async (req, res) => {
    const user = await User.findOne({
      where: {
        email: req.query.email
      }
    })

    return res.json(user)
  }

  public static auth = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(422).json({ error: true, message: 'Invalid username or password' })
    }

    let user = await User.findOne({ where: { username } })

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