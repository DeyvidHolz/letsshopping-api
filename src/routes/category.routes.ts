import express from 'express';

import CategoryController from '../controllers/category.controller';
import AdminMiddleware from '../middlewares/admin.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import CategoryValidatorMiddleware from '../middlewares/validators/categoryValidator.middleware';

const router = express.Router();

router.get('/all', AuthMiddleware, AdminMiddleware, CategoryController.getAll);

router.get(
  '/search',
  AuthMiddleware,
  AdminMiddleware,
  CategoryController.searchByName,
);

router.get(
  '/:id/products',
  AuthMiddleware,
  AdminMiddleware,
  CategoryController.getProductsByCategory,
);

router.get('/:id', AuthMiddleware, AdminMiddleware, CategoryController.get);

router.delete(
  '/:id',
  AuthMiddleware,
  AdminMiddleware,
  CategoryController.delete,
);

router.post(
  '/',
  AuthMiddleware,
  AdminMiddleware,
  CategoryValidatorMiddleware.create,
  CategoryController.create,
);

router.patch(
  '/:id',
  AuthMiddleware,
  AdminMiddleware,
  CategoryValidatorMiddleware.update,
  CategoryController.update,
);

export default router;
