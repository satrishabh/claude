import { Request, Response, NextFunction } from 'express';
import { CustomerService } from './customer.service';
import { ApiResponse } from '../../common/ApiResponse';

export class CustomerController {
  private service: CustomerService;

  constructor() {
    this.service = new CustomerService();
  }

  getMe = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.getMe(req.customerId!);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  updateMe = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.updateMe(req.customerId!, req.body);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  getAddresses = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.getAddresses(req.customerId!);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  addAddress = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.addAddress(req.customerId!, req.body);
      ApiResponse.success(res, data, 201);
    } catch (err) {
      next(err);
    }
  };

  updateAddress = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.updateAddress(req.customerId!, req.params.addressId, req.body);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  deleteAddress = (req: Request, res: Response, next: NextFunction): void => {
    try {
      this.service.deleteAddress(req.customerId!, req.params.addressId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
