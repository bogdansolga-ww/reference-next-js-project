import { Messages } from "@/lib/core/i18n/messages";
import { cartRepository } from "@/lib/repositories/cartRepository";
import { productRepository } from "@/lib/repositories/productRepository";
import type { AddToCartDto, CartItemResponse, CartSummaryResponse, UpdateCartItemDto } from "@/lib/types/cart";
import { NotFoundError } from "./sectionService";

export class CartError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CartError";
  }
}

export const cartService = {
  /**
   * Get user's cart with all items and calculated total
   */
  async getUserCart(userId: string): Promise<CartSummaryResponse> {
    const items = await cartRepository.findByUserId(userId);

    const cartItems: CartItemResponse[] = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productPrice: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
    }));

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: cartItems,
      total,
      itemCount,
    };
  },

  /**
   * Add product to cart
   */
  async addToCart(userId: string, data: AddToCartDto): Promise<CartItemResponse> {
    // Validate product exists
    const product = await productRepository.findById(data.productId);
    if (!product) {
      throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
    }

    // Validate quantity
    if (data.quantity < 1) {
      throw new CartError("Quantity must be at least 1");
    }

    // Add to cart (or update if exists)
    const cartItem = await cartRepository.upsert({
      userId,
      productId: data.productId,
      quantity: data.quantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      id: cartItem.id,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      quantity: cartItem.quantity,
      subtotal: product.price * cartItem.quantity,
    };
  },

  /**
   * Update cart item quantity
   */
  async updateCartItem(userId: string, itemId: number, data: UpdateCartItemDto): Promise<CartItemResponse> {
    // Validate quantity
    if (data.quantity < 1) {
      throw new CartError("Quantity must be at least 1");
    }

    // Get cart item with user verification
    const items = await cartRepository.findByUserId(userId);
    const existingItem = items.find((item) => item.id === itemId);

    if (!existingItem) {
      throw new NotFoundError(Messages.CART_ITEM_NOT_FOUND);
    }

    // Update quantity
    const updated = await cartRepository.updateQuantity(itemId, data.quantity);
    if (!updated) {
      throw new NotFoundError(Messages.CART_ITEM_NOT_FOUND);
    }

    const product = await productRepository.findById(updated.productId);
    if (!product) {
      throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
    }

    return {
      id: updated.id,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      quantity: updated.quantity,
      subtotal: product.price * updated.quantity,
    };
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(userId: string, itemId: number): Promise<void> {
    // Verify item belongs to user
    const items = await cartRepository.findByUserId(userId);
    const existingItem = items.find((item) => item.id === itemId);

    if (!existingItem) {
      throw new NotFoundError(Messages.CART_ITEM_NOT_FOUND);
    }

    await cartRepository.delete(itemId);
  },

  /**
   * Clear entire cart (for fake checkout)
   */
  async clearCart(userId: string): Promise<void> {
    await cartRepository.clearUserCart(userId);
  },

  /**
   * Get cart item count
   */
  async getCartCount(userId: string): Promise<number> {
    return await cartRepository.getCartCount(userId);
  },
};
