import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export default function AdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.user.permissionGroup.level === 1) {
    return next();
  }

  return res.json({
    error: true,
    message: 'You do not have permission to do that.',
  });
}
