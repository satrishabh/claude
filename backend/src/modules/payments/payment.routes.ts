import { Router } from 'express';
import { body } from 'express-validator';
import { PaymentController } from './payment.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';
import { validateMiddleware } from '../../common/middleware/validate.middleware';

const router = Router();
const controller = new PaymentController();

router.use(authMiddleware);

router.post(
  '/',
  [
    body('orderId').isString().notEmpty().withMessage('orderId is required'),
    body('method').isString().notEmpty().withMessage('method is required'),
    body('paymentToken').isString().notEmpty().withMessage('paymentToken is required'),
    body('returnUrl').optional().isURL().withMessage('returnUrl must be a valid URL'),
  ],
  validateMiddleware,
  controller.create
);

router.get('/:paymentId', controller.getById);

router.post(
  '/:paymentId/refund',
  [
    body('amount').optional().isFloat({ min: 0.01 }).withMessage('amount must be a positive number'),
    body('reason').optional().isString(),
  ],
  validateMiddleware,
  controller.refund
);

export default router;
