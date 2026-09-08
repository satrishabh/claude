import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';
import { validateMiddleware } from '../../common/middleware/validate.middleware';

const router = Router();
const controller = new AuthController();

router.post(
  '/register',
  [
    body('username').isString().trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3–50 characters'),
    body('password').isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validateMiddleware,
  controller.register
);

router.post(
  '/login',
  [
    body('username').isString().trim().notEmpty().withMessage('Username is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
  ],
  validateMiddleware,
  controller.login
);

router.post(
  '/refresh',
  [body('refreshToken').isString().notEmpty().withMessage('refreshToken is required')],
  validateMiddleware,
  controller.refresh
);

router.post('/logout', authMiddleware, controller.logout);

export default router;
