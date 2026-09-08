import { Request, Response, NextFunction } from 'express';
import { AppError } from '../AppError';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.status).json({ code: err.code, message: err.message });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' });
}
