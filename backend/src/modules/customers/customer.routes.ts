import { Router } from 'express';
import { body } from 'express-validator';
import { CustomerController } from './customer.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';
import { validateMiddleware } from '../../common/middleware/validate.middleware';

const router = Router();
const controller = new CustomerController();

router.use(authMiddleware);

router.get('/me', controller.getMe);
router.patch(
  '/me',
  [body('username').optional().isString().trim().isLength({ min: 3, max: 50 })],
  validateMiddleware,
  controller.updateMe
);

router.get('/me/addresses', controller.getAddresses);

const addressValidation = [
  body('addressToken').isString().notEmpty().withMessage('addressToken is required'),
  body('countryCode').isString().isLength({ min: 2, max: 2 }).withMessage('countryCode must be a 2-letter ISO code'),
  body('label').optional().isString().trim(),
  body('isDefault').optional().isBoolean(),
];

router.post('/me/addresses', addressValidation, validateMiddleware, controller.addAddress);
router.put('/me/addresses/:addressId', addressValidation, validateMiddleware, controller.updateAddress);
router.delete('/me/addresses/:addressId', controller.deleteAddress);

export default router;
