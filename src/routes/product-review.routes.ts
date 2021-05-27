import express from 'express';

import ProductReviewController from '../controllers/product-review.controller';
import { ProductReviewRequestInterceptor } from '../interceptors/product-review-request.interceptor';
import AuthMiddleware from '../middlewares/auth.middleware';
import ProductReviewValidatorMiddleware from '../middlewares/validators/product-review-validator.middleware';

const router = express.Router();

router.get('/all', AuthMiddleware, ProductReviewController.getAll);

router.delete(
  '/:id',
  AuthMiddleware,
  ProductReviewValidatorMiddleware.delete,
  ProductReviewController.delete,
);

router.get(
  '/:id',
  AuthMiddleware,
  ProductReviewValidatorMiddleware.get,
  ProductReviewController.get,
);

router.post(
  '/:productCode',
  AuthMiddleware,
  ProductReviewRequestInterceptor.create,
  ProductReviewValidatorMiddleware.create,
  ProductReviewController.create,
);

router.patch(
  '/:id',
  AuthMiddleware,
  ProductReviewRequestInterceptor.update,
  ProductReviewValidatorMiddleware.update,
  ProductReviewController.update,
);

export default router;
