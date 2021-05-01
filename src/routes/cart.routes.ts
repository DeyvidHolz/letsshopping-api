import express from 'express';

import CartController from '../controllers/cart.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', AuthMiddleware, CartController.get);
router.post('/:id', AuthMiddleware, CartController.addProduct);
router.put('/:id', AuthMiddleware, CartController.updateProduct);
router.delete('/clear', AuthMiddleware, CartController.clearCart);
router.delete('/:id', AuthMiddleware, CartController.removeProduct);

export default router;
