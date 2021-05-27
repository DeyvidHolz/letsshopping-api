import express from 'express';
import CouponController from '../controllers/coupon.controller';
import AdminMiddleware from '../middlewares/admin.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import CouponValidatorMiddleware from '../middlewares/validators/coupon-validator.middleware';

const router = express.Router();

router.get('/all', AuthMiddleware, AdminMiddleware, CouponController.getAll);

router.delete(
  '/:id',
  AuthMiddleware,
  AdminMiddleware,
  CouponValidatorMiddleware.delete,
  CouponController.delete,
);

router.get(
  '/:id',
  AuthMiddleware,
  AdminMiddleware,
  CouponValidatorMiddleware.get,
  CouponController.get,
);

router.post(
  '/',
  AuthMiddleware,
  AdminMiddleware,
  CouponValidatorMiddleware.create,
  CouponController.create,
);

router.patch(
  '/:id',
  AuthMiddleware,
  AdminMiddleware,
  CouponValidatorMiddleware.update,
  CouponController.update,
);

export default router;
