import { Router } from 'express';
import { body } from 'express-validator';
import { CartController } from './cart.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';
import { validateMiddleware } from '../../common/middleware/validate.middleware';

const router = Router();
const controller = new CartController();

router.use(authMiddleware);

router.get('/', controller.getCart);
router.delete('/', controller.clearCart);

router.post(
  '/items',
  [
    body('productId').isString().notEmpty().withMessage('productId is required'),
    body('quantity').isInt({ min: 1 }).withMessage('quantity must be a positive integer'),
  ],
  validateMiddleware,
  controller.addItem
);

router.patch(
  '/items/:itemId',
  [body('quantity').isInt({ min: 0 }).withMessage('quantity must be a non-negative integer')],
  validateMiddleware,
  controller.updateItem
);

router.delete('/items/:itemId', controller.removeItem);

export default router;
