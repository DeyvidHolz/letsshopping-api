import express from 'express';

import AddressController from '../controllers/address.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/all', AuthMiddleware, AddressController.getAll);
router.delete('/:id', AddressController.delete);
router.get('/:id', AuthMiddleware, AddressController.get);
router.post('/', AuthMiddleware, AddressController.create);
router.patch('/:id', AuthMiddleware, AddressController.update);

export default router;
