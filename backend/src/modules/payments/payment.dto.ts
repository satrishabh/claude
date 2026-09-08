export interface PaymentRequest {
  orderId: string;
  method: string;
  paymentToken: string;
  returnUrl?: string;
}

export interface RefundRequest {
  amount?: number;
  reason?: string;
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';

export interface Payment {
  id: string;
  orderId: string;
  status: PaymentStatus;
  method: string;
  amount: number;
  currency: string;
  paymentToken?: string;
  createdAt: string;
  updatedAt: string;
}
