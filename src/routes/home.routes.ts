import express from 'express'
import UserController from '../controllers/user.controller'

import AuthMiddleware from '../middlewares/auth.middleware'

const router = express.Router()

router.get('/', /* AuthMiddleware */ (req, res) => {
  res.status(200).send('Hello world!');
});

router.post('/api/auth', UserController.auth);

export default router
