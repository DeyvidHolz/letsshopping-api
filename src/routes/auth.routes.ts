import express from 'express';

import UserController from '../controllers/user.controller';

const router = express.Router();
router.post('/auth', UserController.auth);

export default router;
