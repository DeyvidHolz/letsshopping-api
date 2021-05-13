import express from 'express';

import ProductReviewController from '../controllers/productReview.controller';
import { ProductReviewRequestInterceptor } from '../interceptors/productReviewRequest.interceptor';
import AuthMiddleware from '../middlewares/auth.middleware';
import ProductReviewValidatorMiddleware from '../middlewares/validators/productReviewValidator.middleware';

const router = express.Router();

router.get('/all', AuthMiddleware, ProductReviewController.getAll);
router.delete('/:id', ProductReviewController.delete);
router.get('/:id', AuthMiddleware, ProductReviewController.get);

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
