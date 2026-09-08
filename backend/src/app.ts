import express, { Application } from 'express';
import authRoutes from './modules/auth/auth.routes';
import categoryRoutes from './modules/categories/category.routes';
import productRoutes from './modules/products/product.routes';
import cartRoutes from './modules/cart/cart.routes';
import orderRoutes from './modules/orders/order.routes';
import paymentRoutes from './modules/payments/payment.routes';
import customerRoutes from './modules/customers/customer.routes';
import { errorMiddleware } from './common/middleware/error.middleware';

export function createApp(): Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/auth', authRoutes);
  app.use('/categories', categoryRoutes);
  app.use('/products', productRoutes);
  app.use('/cart', cartRoutes);
  app.use('/orders', orderRoutes);
  app.use('/payments', paymentRoutes);
  app.use('/customers', customerRoutes);

  app.use(errorMiddleware);

  return app;
}
