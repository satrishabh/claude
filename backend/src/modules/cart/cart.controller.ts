import { Request, Response, NextFunction } from 'express';
import { CartService } from './cart.service';
import { ApiResponse } from '../../common/ApiResponse';

export class CartController {
  private service: CartService;

  constructor() {
    this.service = new CartService();
  }

  getCart = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.getCart(req.customerId!);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  clearCart = (req: Request, res: Response, next: NextFunction): void => {
    try {
      this.service.clearCart(req.customerId!);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  addItem = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.addItem(req.customerId!, req.body);
      ApiResponse.success(res, data, 201);
    } catch (err) {
      next(err);
    }
  };

  updateItem = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.updateItem(req.customerId!, req.params.itemId, req.body);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };

  removeItem = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.removeItem(req.customerId!, req.params.itemId);
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  };
}
