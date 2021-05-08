import express from 'express';

import ShippingController from '../controllers/shipping.controller';
import AuthMiddleware from '../middlewares/auth.middleware';
import ShippingValidatorMiddleware from '../middlewares/validators/shippingValidator.middleware';

const router = express.Router();

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
