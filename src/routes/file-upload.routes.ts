import express from 'express';
import FileUploadController from '../controllers/file-upload.controller';
import AdminMiddleware from '../middlewares/admin.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';

const router = express.Router();

router.post(
  '/image-upload',
  AuthMiddleware,
  AdminMiddleware,
  FileUploadMiddleware.image,
  FileUploadController.imageUpload,
);

export default router;
