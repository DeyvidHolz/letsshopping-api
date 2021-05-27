import express from 'express';
import PermissionGroupController from '../controllers/permission-group.controller';

import AdminMiddleware from '../middlewares/admin.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import PermissionGroupValidatorMiddleware from '../middlewares/validators/permission-group-validator.middleware';

const router = express.Router();

router.patch(
  '/set-group/:userId/:name',
  AuthMiddleware,
  AdminMiddleware,
  PermissionGroupValidatorMiddleware.setUserPermissionGroup,
  PermissionGroupController.setUserPermissionGroup,
);

router.get(
  '/all',
  AuthMiddleware,
  AdminMiddleware,
  PermissionGroupController.getAll,
);

router.get(
  '/:name',
  AuthMiddleware,
  AdminMiddleware,
  PermissionGroupValidatorMiddleware.get,
  PermissionGroupController.get,
);

router.post(
  '/',
  AuthMiddleware,
  AdminMiddleware,
  PermissionGroupValidatorMiddleware.create,
  PermissionGroupController.create,
);

router.patch(
  '/:name',
  AuthMiddleware,
  AdminMiddleware,
  PermissionGroupValidatorMiddleware.update,
  PermissionGroupController.update,
);

router.delete(
  '/:name',
  AuthMiddleware,
  AdminMiddleware,
  PermissionGroupValidatorMiddleware.delete,
  PermissionGroupController.delete,
);

export default router;
