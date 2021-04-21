import express from 'express';

import OrderController from '../controllers/order.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/all', AuthMiddleware, OrderController.getAll);
router.get('/:id', AuthMiddleware, OrderController.get);
router.post('/', AuthMiddleware, OrderController.create);

export default router;
