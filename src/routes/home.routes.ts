import express from 'express'
import UserController from '../controllers/user.controller'

const router = express.Router()

router.get('/', /* middleware */ (req, res) => {
  res.status(200).send('Hello world!')
})

router.post('/api/auth', UserController.auth)
router.post('/api/users/create', UserController.create)

export default router
