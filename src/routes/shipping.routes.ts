import express from 'express';
import ShippingController from '../controllers/shipping.controller';
import AuthMiddleware from '../middlewares/auth.middleware';
import ShippingValidatorMiddleware from '../middlewares/validators/shipping-validator.middleware';

const router = express.Router();

router.get(
  '/:id',
  AuthMiddleware,
  ShippingValidatorMiddleware.get,
  ShippingController.get,
);

router.post(
  '/',
  AuthMiddleware,
  ShippingValidatorMiddleware.create,
  ShippingController.create,
);

router.patch(
  '/:id',
  AuthMiddleware,
  ShippingValidatorMiddleware.update,
  ShippingController.update,
);

export default router;
