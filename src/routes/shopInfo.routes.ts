import express from 'express';

import ShopInfoController from '../controllers/shopInfo.controller';
import AdminMiddleware from '../middlewares/admin.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import ShopInfoValidatorMiddleware from '../middlewares/validators/shopInfoValidator.middleware';

const router = express.Router();

router.get('/', AuthMiddleware, AdminMiddleware, ShopInfoController.get);

router.post(
  '/',
  AuthMiddleware,
  AdminMiddleware,
  ShopInfoValidatorMiddleware.create,
  ShopInfoController.create,
);

router.patch(
  '/',
  AuthMiddleware,
  AdminMiddleware,
  ShopInfoValidatorMiddleware.update,
  ShopInfoController.update,
);

export default router;
