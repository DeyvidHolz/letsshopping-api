import express from 'express';

import ProductReviewController from '../controllers/productReview.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/all', AuthMiddleware, ProductReviewController.getAll);
router.delete('/:id', ProductReviewController.delete);
router.get('/:id', AuthMiddleware, ProductReviewController.get);
router.post('/', ProductReviewController.create);
router.put('/:id', AuthMiddleware, ProductReviewController.update);

export default router;
