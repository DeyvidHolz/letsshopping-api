export {};

declare global {
  namespace Express {
    interface Request {
      entity: any;
    }
  }
}
