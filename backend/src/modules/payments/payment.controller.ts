import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import { ApiResponse } from '../../common/ApiResponse';

export class PaymentController {
  private service: PaymentService;

  constructor() {
    this.service = new PaymentService();
  }

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.create(req.customerId!, req.body);
      ApiResponse.success(res, data, 201);
    } catch (err) {
      next(err);
    }
  };

  getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.findById(req.customerId!, req.params.paymentId);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  refund = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.refund(req.customerId!, req.params.paymentId, req.body);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };
}
