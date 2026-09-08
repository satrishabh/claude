import { Router } from 'express';
import { body } from 'express-validator';
import { ProductController } from './product.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';
import { validateMiddleware } from '../../common/middleware/validate.middleware';

const router = Router();
const controller = new ProductController();

const productValidation = [
  body('sku').isString().trim().notEmpty().withMessage('SKU is required'),
  body('name').isString().trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('currency').isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),
  body('stockQuantity').isInt({ min: 0 }).withMessage('stockQuantity must be a non-negative integer'),
  body('categoryId').isString().notEmpty().withMessage('categoryId is required'),
  body('description').optional().isString(),
  body('compareAtPrice').optional().isFloat({ min: 0 }),
  body('images').optional().isArray(),
  body('tags').optional().isArray(),
  body('isActive').optional().isBoolean(),
];

const patchValidation = [
  body('name').optional().isString().trim().isLength({ min: 1 }),
  body('price').optional().isFloat({ min: 0 }),
  body('stockQuantity').optional().isInt({ min: 0 }),
  body('categoryId').optional().isString().notEmpty(),
  body('description').optional().isString(),
  body('compareAtPrice').optional().isFloat({ min: 0 }),
  body('images').optional().isArray(),
  body('tags').optional().isArray(),
  body('isActive').optional().isBoolean(),
];

router.get('/', controller.getAll);
router.get('/:productId', controller.getById);
router.post('/', authMiddleware, productValidation, validateMiddleware, controller.create);
router.put('/:productId', authMiddleware, productValidation, validateMiddleware, controller.update);
router.patch('/:productId', authMiddleware, patchValidation, validateMiddleware, controller.patch);
router.delete('/:productId', authMiddleware, controller.delete);

export default router;
