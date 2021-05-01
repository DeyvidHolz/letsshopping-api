import express from 'express';

import CouponController from '../controllers/coupon.controller';
import AdminMiddleware from '../middlewares/admin.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/all', AuthMiddleware, AdminMiddleware, CouponController.getAll);
router.delete('/:id', CouponController.delete);
router.get('/:id', AuthMiddleware, AdminMiddleware, CouponController.get);
router.post('/', CouponController.create);
router.put('/', AuthMiddleware, AdminMiddleware, CouponController.update);

export default router;
