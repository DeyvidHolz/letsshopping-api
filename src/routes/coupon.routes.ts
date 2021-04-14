import express from 'express';

import CouponController from '../controllers/coupon.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/all', AuthMiddleware, CouponController.getAll);
router.delete('/:id', CouponController.delete);
router.get('/:id', AuthMiddleware, CouponController.get);
router.post('/', CouponController.create);
router.put('/', AuthMiddleware, CouponController.update);

export default router;
