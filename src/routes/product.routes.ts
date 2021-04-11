import express, { Request, Response } from 'express';
import ProductController from '../controllers/product.controller';

import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/all', AuthMiddleware, ProductController.getAll);
router.get('/:id', AuthMiddleware, ProductController.get);
router.post('/', AuthMiddleware, ProductController.create);
router.put('/', AuthMiddleware, ProductController.update);
router.delete('/:id', AuthMiddleware, ProductController.delete);

export default router;
