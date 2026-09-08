import { AppError } from '../../common/AppError';
import { CartRepository } from './cart.repository';
import { ProductRepository } from '../products/product.repository';
import { Cart, CartItem, CartItemRequest, CartItemUpdateRequest } from './cart.dto';

export class CartService {
  private cartRepo: CartRepository;
  private productRepo: ProductRepository;

  constructor() {
    this.cartRepo = new CartRepository();
    this.productRepo = new ProductRepository();
  }

  private getOrCreateCart(customerId: string): { id: string; updatedAt: string } {
    let cart = this.cartRepo.findCartByCustomerId(customerId);
    if (!cart) {
      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      this.cartRepo.createCart({ id, customer_id: customerId, updated_at: now });
      return { id, updatedAt: now };
    }
    return { id: cart.id, updatedAt: cart.updated_at };
  }

  private buildCart(customerId: string): Cart {
    const cart = this.cartRepo.findCartByCustomerId(customerId);
    if (!cart) {
      return {
        id: '',
        customerId,
        items: [],
        subtotal: 0,
        updatedAt: new Date().toISOString(),
      };
    }

    const rows = this.cartRepo.findItemsByCartId(cart.id);
    const items: CartItem[] = rows.map((row) => ({
      id: row.id,
      productId: row.product_id,
      productName: row.product_name,
      sku: row.sku,
      quantity: row.quantity,
      unitPrice: row.unit_price,
      lineTotal: row.quantity * row.unit_price,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

    return {
      id: cart.id,
      customerId,
      items,
      subtotal,
      updatedAt: cart.updated_at,
    };
  }

  getCart(customerId: string): Cart {
    return this.buildCart(customerId);
  }

  addItem(customerId: string, dto: CartItemRequest): Cart {
    const product = this.productRepo.findById(dto.productId);
    if (!product) {
      throw new AppError(404, 'NOT_FOUND', `Product ${dto.productId} not found`);
    }
    if (product.stock_quantity < dto.quantity) {
      throw new AppError(400, 'INSUFFICIENT_STOCK', 'Not enough stock available');
    }

    const { id: cartId } = this.getOrCreateCart(customerId);
    const existing = this.cartRepo.findItemByProductId(cartId, dto.productId);

    if (existing) {
      this.cartRepo.updateItem(existing.id, existing.quantity + dto.quantity);
    } else {
      this.cartRepo.addItem({
        id: crypto.randomUUID(),
        cart_id: cartId,
        product_id: dto.productId,
        quantity: dto.quantity,
        unit_price: product.price,
      });
    }

    this.cartRepo.updateCartTimestamp(cartId, new Date().toISOString());
    return this.buildCart(customerId);
  }

  updateItem(customerId: string, itemId: string, dto: CartItemUpdateRequest): Cart {
    const cart = this.cartRepo.findCartByCustomerId(customerId);
    if (!cart) {
      throw new AppError(404, 'NOT_FOUND', 'Cart not found');
    }

    const item = this.cartRepo.findItemById(itemId);
    if (!item || item.cart_id !== cart.id) {
      throw new AppError(404, 'NOT_FOUND', `Cart item ${itemId} not found`);
    }

    if (dto.quantity <= 0) {
      this.cartRepo.deleteItem(itemId);
    } else {
      this.cartRepo.updateItem(itemId, dto.quantity);
    }

    this.cartRepo.updateCartTimestamp(cart.id, new Date().toISOString());
    return this.buildCart(customerId);
  }

  removeItem(customerId: string, itemId: string): Cart {
    const cart = this.cartRepo.findCartByCustomerId(customerId);
    if (!cart) {
      throw new AppError(404, 'NOT_FOUND', 'Cart not found');
    }

    const item = this.cartRepo.findItemById(itemId);
    if (!item || item.cart_id !== cart.id) {
      throw new AppError(404, 'NOT_FOUND', `Cart item ${itemId} not found`);
    }

    this.cartRepo.deleteItem(itemId);
    this.cartRepo.updateCartTimestamp(cart.id, new Date().toISOString());
    return this.buildCart(customerId);
  }

  clearCart(customerId: string): void {
    const cart = this.cartRepo.findCartByCustomerId(customerId);
    if (cart) {
      this.cartRepo.clearCart(cart.id);
      this.cartRepo.deleteCart(cart.id);
    }
  }
}
