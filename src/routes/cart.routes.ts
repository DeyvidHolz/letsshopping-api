import express from 'express';

import CartController from '../controllers/cart.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', AuthMiddleware, CartController.get);
router.post('/:code', AuthMiddleware, CartController.addProduct);
router.patch('/:code', AuthMiddleware, CartController.updateProduct);
router.delete('/', AuthMiddleware, CartController.clearCart);
router.delete('/:code', AuthMiddleware, CartController.removeProduct);

export default router;
