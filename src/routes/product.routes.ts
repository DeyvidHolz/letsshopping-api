import express from 'express';

import ProductController from '../controllers/product.controller';
import { ProductRequestInterceptor } from '../interceptors/productRequest.interceptor';
import AdminMiddleware from '../middlewares/admin.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import ProductValidatorMiddleware from '../middlewares/validators/productValidator.middleware';

const router = express.Router();

router.get('/all', AuthMiddleware, AdminMiddleware, ProductController.getAll);

router.get(
  '/search',
  AuthMiddleware,
  AdminMiddleware,
  ProductController.searchByName,
);

router.get(
  '/:code',
  AuthMiddleware,
  AdminMiddleware,
  ProductValidatorMiddleware.get,
  ProductController.get,
);

router.delete(
  '/:code',
  AuthMiddleware,
  AdminMiddleware,
  ProductValidatorMiddleware.delete,
  ProductController.delete,
);

router.post(
  '/',
  AuthMiddleware,
  AdminMiddleware,
  ProductRequestInterceptor.create,
  ProductValidatorMiddleware.create,
  ProductController.create,
);

router.patch(
  '/:code',
  AuthMiddleware,
  AdminMiddleware,
  ProductRequestInterceptor.update,
  ProductValidatorMiddleware.update,
  ProductController.update,
);

export default router;
