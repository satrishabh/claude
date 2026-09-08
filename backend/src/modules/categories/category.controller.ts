import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service';
import { ApiResponse } from '../../common/ApiResponse';

export class CategoryController {
  private service: CategoryService;

  constructor() {
    this.service = new CategoryService();
  }

  getAll = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.findAll();
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.findById(req.params.categoryId);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.create(req.body);
      ApiResponse.success(res, data, 201);
    } catch (err) {
      next(err);
    }
  };

  update = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.update(req.params.categoryId, req.body);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      this.service.delete(req.params.categoryId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
