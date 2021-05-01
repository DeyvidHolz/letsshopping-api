import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

import { getUserData } from '../helpers/auth.helper';

dotenv.config();

export default function AdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = getUserData(req.headers.authorization);

  console.log(user);

  if (user.permission_level === 1) {
    return next();
  }

  return res.json({
    error: true,
    message: 'You do not have permission to do that.',
  });
}
