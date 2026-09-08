import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../ApiResponse';

export function validateMiddleware(req: Request, res: Response, next: NextFunction): void {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((error) => ({
      field: error.type === 'field' ? (error as { path: string }).path : 'unknown',
      message: error.msg as string,
    }));
    ApiResponse.validationError(res, errors);
    return;
  }

  next();
}
