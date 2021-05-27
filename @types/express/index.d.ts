import { User } from '../../src/entities/user.entity';

export {};

declare global {
  namespace Express {
    interface Request {
      dto: any;
      user: User;
      interceptor: any;
    }
  }
}
