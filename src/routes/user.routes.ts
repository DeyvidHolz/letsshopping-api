import express from 'express';

import UserController from '../controllers/user.controller';
import AdminMiddleware from '../middlewares/admin.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import UserValidatorMiddleware from '../middlewares/validators/userValidator.middleware';

const router = express.Router();

// TODO: create this on an user admin controller
router.get('/all', AuthMiddleware, AdminMiddleware, UserController.getAll);
router.get('/search', AuthMiddleware, UserController.search);

router.get('/', AuthMiddleware, UserController.get);
router.post('/', UserValidatorMiddleware.create, UserController.create);

router.patch(
  '/',
  AuthMiddleware,
  UserValidatorMiddleware.update,
  UserController.update,
);

router.delete('/', UserController.delete);

export default router;
