import express from 'express';
import PermissionGroupController from '../controllers/permissionGroup.controller';

import AdminMiddleware from '../middlewares/admin.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.patch(
  '/set-group/:userId/:name',
  AuthMiddleware,
  AdminMiddleware,
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
  PermissionGroupController.get,
);

router.post(
  '/',
  AuthMiddleware,
  AdminMiddleware,
  PermissionGroupController.create,
);

router.patch(
  '/:name',
  AuthMiddleware,
  AdminMiddleware,
  PermissionGroupController.update,
);

router.delete(
  '/:name',
  AuthMiddleware,
  AdminMiddleware,
  PermissionGroupController.delete,
);

export default router;
