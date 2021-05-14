import { User } from '../../src/entities/User.entity';

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
