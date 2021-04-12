import express from 'express';
import CategoryController from '../controllers/category.controller';

import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/all', AuthMiddleware, CategoryController.getAll);

router.get(
  '/:id/products',
  AuthMiddleware,
  CategoryController.getProductsByCategory,
);

router.get('/:id', AuthMiddleware, CategoryController.get);
router.post('/', AuthMiddleware, CategoryController.create);
router.put('/', AuthMiddleware, CategoryController.update);
router.delete('/:id', AuthMiddleware, CategoryController.delete);

export default router;
