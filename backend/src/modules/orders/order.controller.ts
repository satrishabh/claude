import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';
import { ApiResponse } from '../../common/ApiResponse';
import { OrderQuery } from './order.dto';

export class OrderController {
  private service: OrderService;

  constructor() {
    this.service = new OrderService();
  }

  getAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const query: OrderQuery = {
        status: req.query.status as string | undefined,
        page: req.query.page ? Number(req.query.page) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
      };
      const data = this.service.findAll(req.customerId!, query);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.findById(req.customerId!, req.params.orderId);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.create(req.customerId!, req.body);
      ApiResponse.success(res, data, 201);
    } catch (err) {
      next(err);
    }
  };

  cancel = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.cancel(req.customerId!, req.params.orderId);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };
}
