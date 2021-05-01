import express from 'express';

import ShopInfoController from '../controllers/shopInfo.controller';
import AdminMiddleware from '../middlewares/admin.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', AuthMiddleware, AdminMiddleware, ShopInfoController.get);
router.post('/', AuthMiddleware, AdminMiddleware, ShopInfoController.create);
router.put('/', AuthMiddleware, AdminMiddleware, ShopInfoController.update);

export default router;
