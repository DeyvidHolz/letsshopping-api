import express, { Request, Response } from 'express';
import ProductController from '../controllers/product.controller';

import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/all', AuthMiddleware, ProductController.getAll);
router.get('/', AuthMiddleware, ProductController.get);
router.post('/', AuthMiddleware, ProductController.create);

export default router;
