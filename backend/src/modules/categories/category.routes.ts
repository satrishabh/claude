import { Router } from 'express';
import { body } from 'express-validator';
import { CategoryController } from './category.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';
import { validateMiddleware } from '../../common/middleware/validate.middleware';

const router = Router();
const controller = new CategoryController();

const categoryValidation = [
  body('name').isString().trim().isLength({ min: 1, max: 100 }).withMessage('Name is required'),
  body('description').optional().isString().trim(),
  body('imageUrl').optional().isURL().withMessage('imageUrl must be a valid URL'),
  body('parentId').optional().isString().withMessage('parentId must be a string'),
];

router.get('/', controller.getAll);
router.get('/:categoryId', controller.getById);
router.post('/', authMiddleware, categoryValidation, validateMiddleware, controller.create);
router.put('/:categoryId', authMiddleware, categoryValidation, validateMiddleware, controller.update);
router.delete('/:categoryId', authMiddleware, controller.delete);

export default router;
