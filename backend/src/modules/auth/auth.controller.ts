import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../common/ApiResponse';

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.register(req.body);
      ApiResponse.success(res, result, 201);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.login(req.body);
      ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.refresh(req.body);
      ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  };

  logout = (req: Request, res: Response, next: NextFunction): void => {
    try {
      this.service.logout(req.customerId!);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
