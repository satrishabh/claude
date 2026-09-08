import { Response } from 'express';

export class ApiResponse {
  static success<T>(res: Response, data: T, status = 200): Response {
    return res.status(status).json(data);
  }

  static error(res: Response, status: number, code: string, message: string): Response {
    return res.status(status).json({ code, message });
  }

  static validationError(
    res: Response,
    errors: { field: string; message: string }[]
  ): Response {
    return res.status(422).json({
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors,
    });
  }
}
