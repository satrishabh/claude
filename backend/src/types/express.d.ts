import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      customerId?: string;
    }
  }
}

export {};
