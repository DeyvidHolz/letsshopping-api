import express from 'express';

import ShopInfoController from '../controllers/shopInfo.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', AuthMiddleware, ShopInfoController.get);
router.post('/', AuthMiddleware, ShopInfoController.create);
router.put('/', AuthMiddleware, ShopInfoController.update);

export default router;
