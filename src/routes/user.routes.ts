import express from 'express';

import UserController from '../controllers/user.controller';
import { UserRequestInterceptor } from '../interceptors/user-request.interceptor';
import AdminMiddleware from '../middlewares/admin.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import UserValidatorMiddleware from '../middlewares/validators/user-validator.middleware';

const router = express.Router();

// TODO: create this on an user admin controller
router.get('/all', AuthMiddleware, AdminMiddleware, UserController.getAll);
router.get('/search', AuthMiddleware, UserController.search);
router.get('/', AuthMiddleware, UserController.get);

router.post(
  '/',
  UserRequestInterceptor.create,
  UserValidatorMiddleware.create,
  UserController.create,
);

router.patch(
  '/',
  AuthMiddleware,
  UserRequestInterceptor.update,
  UserValidatorMiddleware.update,
  UserController.update,
);

router.delete('/', AuthMiddleware, UserController.delete);

export default router;
