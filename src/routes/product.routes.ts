import express from 'express';
import ProductController from '../controllers/product.controller';
import AdminMiddleware from '../middlewares/admin.middleware';

import AuthMiddleware from '../middlewares/auth.middleware';

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

router.post('/', AuthMiddleware, AdminMiddleware, ProductController.create);
router.put('/', AuthMiddleware, AdminMiddleware, ProductController.update);

export default router;
