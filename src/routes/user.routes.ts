import express, { Request, Response } from 'express';
import UserController from '../controllers/user.controller';

import AuthMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/all', AuthMiddleware, UserController.getAll);

router.get('/', AuthMiddleware, UserController.get);

router.post('/', UserController.create);

router.put('/', AuthMiddleware, (req: Request, res: Response) => {

});

router.delete('/', (req: Request, res: Response) => {

});

export default router;