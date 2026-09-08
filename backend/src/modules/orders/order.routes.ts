import { Router } from 'express';
import { body } from 'express-validator';
import { OrderController } from './order.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';
import { validateMiddleware } from '../../common/middleware/validate.middleware';

const router = Router();
const controller = new OrderController();

router.use(authMiddleware);

router.get('/', controller.getAll);

router.post(
  '/',
  [
    body('shippingAddressId').isString().notEmpty().withMessage('shippingAddressId is required'),
    body('billingAddressId').isString().notEmpty().withMessage('billingAddressId is required'),
    body('notes').optional().isString(),
  ],
  validateMiddleware,
  controller.create
);

router.get('/:orderId', controller.getById);
router.post('/:orderId/cancel', controller.cancel);

export default router;
