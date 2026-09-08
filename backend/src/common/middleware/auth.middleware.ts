import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../AppError';

interface AccessTokenPayload {
  customerId: string;
  type: string;
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Missing or invalid authorization header'));
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET ?? 'dev-secret';

  try {
    const payload = jwt.verify(token, secret) as AccessTokenPayload;

    if (payload.type !== 'access') {
      return next(new AppError(401, 'UNAUTHORIZED', 'Invalid token type'));
    }

    req.customerId = payload.customerId;
    next();
  } catch {
    next(new AppError(401, 'UNAUTHORIZED', 'Invalid or expired token'));
  }
}
