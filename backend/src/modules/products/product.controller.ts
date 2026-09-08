import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { ApiResponse } from '../../common/ApiResponse';
import { ProductQuery } from './product.dto';

export class ProductController {
  private service: ProductService;

  constructor() {
    this.service = new ProductService();
  }

  getAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const query: ProductQuery = {
        categoryId: req.query.categoryId as string | undefined,
        search: req.query.search as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        inStock: req.query.inStock === 'true',
        page: req.query.page ? Number(req.query.page) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') ?? undefined,
      };
      const data = this.service.findAll(query);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.findById(req.params.productId);
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
      const data = this.service.update(req.params.productId, req.body);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  patch = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.patch(req.params.productId, req.body);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      this.service.delete(req.params.productId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
