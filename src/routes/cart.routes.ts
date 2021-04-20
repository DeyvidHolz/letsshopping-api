import express from 'express';

import CartController from '../controllers/cart.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', AuthMiddleware, CartController.get);
router.post('/', AuthMiddleware, CartController.addProduct);
router.put('/', AuthMiddleware, CartController.updateProduct);
router.delete('/clear', AuthMiddleware, CartController.clearCart);
router.delete('/', AuthMiddleware, CartController.removeProduct);

export default router;
