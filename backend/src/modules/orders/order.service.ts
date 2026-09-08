import { AppError } from '../../common/AppError';
import { OrderRepository, OrderRow, OrderItemRow } from './order.repository';
import { CartRepository } from '../cart/cart.repository';
import { Order, OrderItem, OrderPage, OrderQuery, CreateOrderRequest } from './order.dto';
import { AddressRepository } from '../customers/customer.repository';

function toOrder(row: OrderRow, items: OrderItemRow[]): Order {
  return {
    id: row.id,
    customerId: row.customer_id,
    status: row.status as Order['status'],
    shippingAddressId: row.shipping_address_id,
    billingAddressId: row.billing_address_id,
    items: items.map(
      (i): OrderItem => ({
        id: i.id,
        productId: i.product_id,
        productName: i.product_name,
        sku: i.sku,
        quantity: i.quantity,
        unitPrice: i.unit_price,
        lineTotal: i.line_total,
      })
    ),
    subtotal: row.subtotal,
    shippingCost: row.shipping_cost,
    taxAmount: row.tax_amount,
    total: row.total,
    currency: row.currency,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class OrderService {
  private orderRepo: OrderRepository;
  private cartRepo: CartRepository;
  private addressRepo: AddressRepository;

  constructor() {
    this.orderRepo = new OrderRepository();
    this.cartRepo = new CartRepository();
    this.addressRepo = new AddressRepository();
  }

  findAll(customerId: string, query: OrderQuery): OrderPage {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20));
    const { rows, total } = this.orderRepo.findByCustomerId(customerId, query.status, page, pageSize);

    const orders = rows.map((row) => {
      const items = this.orderRepo.findItemsByOrderId(row.id);
      return toOrder(row, items);
    });

    return {
      data: orders,
      pagination: {
        page,
        pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  findById(customerId: string, orderId: string): Order {
    const row = this.orderRepo.findById(orderId);
    if (!row || row.customer_id !== customerId) {
      throw new AppError(404, 'NOT_FOUND', `Order ${orderId} not found`);
    }
    const items = this.orderRepo.findItemsByOrderId(orderId);
    return toOrder(row, items);
  }

  create(customerId: string, dto: CreateOrderRequest): Order {
    const shippingAddr = this.addressRepo.findById(dto.shippingAddressId);
    if (!shippingAddr || shippingAddr.customer_id !== customerId) {
      throw new AppError(404, 'NOT_FOUND', 'Shipping address not found');
    }

    const billingAddr = this.addressRepo.findById(dto.billingAddressId);
    if (!billingAddr || billingAddr.customer_id !== customerId) {
      throw new AppError(404, 'NOT_FOUND', 'Billing address not found');
    }

    const cart = this.cartRepo.findCartByCustomerId(customerId);
    if (!cart) {
      throw new AppError(400, 'EMPTY_CART', 'Cart is empty');
    }

    const cartItems = this.cartRepo.findItemsByCartId(cart.id);
    if (cartItems.length === 0) {
      throw new AppError(400, 'EMPTY_CART', 'Cart is empty');
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const shippingCost = 0;
    const taxAmount = 0;
    const total = subtotal + shippingCost + taxAmount;
    const now = new Date().toISOString();
    const orderId = crypto.randomUUID();

    const orderRow: OrderRow = {
      id: orderId,
      customer_id: customerId,
      status: 'pending',
      shipping_address_id: dto.shippingAddressId,
      billing_address_id: dto.billingAddressId,
      subtotal,
      shipping_cost: shippingCost,
      tax_amount: taxAmount,
      total,
      currency: 'USD',
      notes: dto.notes ?? null,
      created_at: now,
      updated_at: now,
    };

    const orderItems: OrderItemRow[] = cartItems.map((ci) => ({
      id: crypto.randomUUID(),
      order_id: orderId,
      product_id: ci.product_id,
      product_name: ci.product_name,
      sku: ci.sku,
      quantity: ci.quantity,
      unit_price: ci.unit_price,
      line_total: ci.quantity * ci.unit_price,
    }));

    this.orderRepo.create(orderRow);
    this.orderRepo.createItems(orderItems);
    this.cartRepo.clearCart(cart.id);
    this.cartRepo.deleteCart(cart.id);

    return toOrder(orderRow, orderItems);
  }

  cancel(customerId: string, orderId: string): Order {
    const row = this.orderRepo.findById(orderId);
    if (!row || row.customer_id !== customerId) {
      throw new AppError(404, 'NOT_FOUND', `Order ${orderId} not found`);
    }

    if (!['pending', 'confirmed'].includes(row.status)) {
      throw new AppError(400, 'INVALID_STATUS', `Cannot cancel an order with status '${row.status}'`);
    }

    const now = new Date().toISOString();
    this.orderRepo.updateStatus(orderId, 'cancelled', now);
    const items = this.orderRepo.findItemsByOrderId(orderId);
    return toOrder({ ...row, status: 'cancelled', updated_at: now }, items);
  }
}
