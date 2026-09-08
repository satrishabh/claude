import { AppError } from '../../common/AppError';
import { PaymentRepository, PaymentRow } from './payment.repository';
import { OrderRepository } from '../orders/order.repository';
import { Payment, PaymentRequest, PaymentStatus, RefundRequest } from './payment.dto';

function toPayment(row: PaymentRow): Payment {
  return {
    id: row.id,
    orderId: row.order_id,
    status: row.status as PaymentStatus,
    method: row.method,
    amount: row.amount,
    currency: row.currency,
    paymentToken: row.payment_token ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class PaymentService {
  private paymentRepo: PaymentRepository;
  private orderRepo: OrderRepository;

  constructor() {
    this.paymentRepo = new PaymentRepository();
    this.orderRepo = new OrderRepository();
  }

  create(customerId: string, dto: PaymentRequest): Payment {
    const order = this.orderRepo.findById(dto.orderId);
    if (!order || order.customer_id !== customerId) {
      throw new AppError(404, 'NOT_FOUND', `Order ${dto.orderId} not found`);
    }

    if (order.status === 'cancelled') {
      throw new AppError(400, 'ORDER_CANCELLED', 'Cannot pay for a cancelled order');
    }

    const existingPayment = this.paymentRepo.findByOrderId(dto.orderId);
    if (existingPayment && ['completed', 'processing'].includes(existingPayment.status)) {
      throw new AppError(409, 'CONFLICT', 'Payment already exists for this order');
    }

    const now = new Date().toISOString();
    const row: PaymentRow = {
      id: crypto.randomUUID(),
      order_id: dto.orderId,
      status: 'processing',
      method: dto.method,
      amount: order.total,
      currency: order.currency,
      payment_token: dto.paymentToken,
      created_at: now,
      updated_at: now,
    };

    this.paymentRepo.create(row);
    this.orderRepo.updateStatus(dto.orderId, 'confirmed', now);

    // Simulate payment processing: mark as completed immediately
    this.paymentRepo.updateStatus(row.id, 'completed', now);

    return toPayment({ ...row, status: 'completed', updated_at: now });
  }

  findById(customerId: string, paymentId: string): Payment {
    const payment = this.paymentRepo.findById(paymentId);
    if (!payment) {
      throw new AppError(404, 'NOT_FOUND', `Payment ${paymentId} not found`);
    }

    const order = this.orderRepo.findById(payment.order_id);
    if (!order || order.customer_id !== customerId) {
      throw new AppError(403, 'FORBIDDEN', 'Access denied');
    }

    return toPayment(payment);
  }

  refund(customerId: string, paymentId: string, dto: RefundRequest): Payment {
    const payment = this.paymentRepo.findById(paymentId);
    if (!payment) {
      throw new AppError(404, 'NOT_FOUND', `Payment ${paymentId} not found`);
    }

    const order = this.orderRepo.findById(payment.order_id);
    if (!order || order.customer_id !== customerId) {
      throw new AppError(403, 'FORBIDDEN', 'Access denied');
    }

    if (payment.status !== 'completed') {
      throw new AppError(400, 'INVALID_STATUS', 'Only completed payments can be refunded');
    }

    const refundAmount = dto.amount ?? payment.amount;
    if (refundAmount > payment.amount) {
      throw new AppError(400, 'INVALID_AMOUNT', 'Refund amount cannot exceed payment amount');
    }

    const now = new Date().toISOString();
    const newStatus = refundAmount < payment.amount ? 'partially_refunded' : 'refunded';
    this.paymentRepo.updateStatus(paymentId, newStatus, now);

    return toPayment({ ...payment, status: newStatus, updated_at: now });
  }
}
