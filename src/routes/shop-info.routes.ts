import express from 'express';

import ShopInfoController from '../controllers/shop-info.controller';
import { ShopInfoRequestInterceptor } from '../interceptors/shop-info-request.interceptor';
import AdminMiddleware from '../middlewares/admin.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import ShopInfoValidatorMiddleware from '../middlewares/validators/shopInfo-validator.middleware';

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
  ShopInfoRequestInterceptor.update,
  ShopInfoValidatorMiddleware.update,
  ShopInfoController.update,
);

export default router;
