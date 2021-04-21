import express from 'express';

import ShippingController from '../controllers/shipping.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', AuthMiddleware, ShippingController.create);
router.put('/', AuthMiddleware, ShippingController.update);

export default router;
