import express from 'express';
import ProductController from '../controllers/product.controller';
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

router.get('/:id', AuthMiddleware, AdminMiddleware, ProductController.get);

router.delete(
  '/:id',
  AuthMiddleware,
  AdminMiddleware,
  ProductController.delete,
);

router.post(
  '/',
  AuthMiddleware,
  AdminMiddleware,
  ProductValidatorMiddleware.create,
  ProductController.create,
);

router.patch(
  '/:id',
  AuthMiddleware,
  AdminMiddleware,
  ProductValidatorMiddleware.update,
  ProductController.update,
);

export default router;
