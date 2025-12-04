import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { type CartItem, cartItems, type NewCartItem, type Product, products } from "@/lib/db/schema";

export type CartItemWithProduct = CartItem & { product: Product };

export const cartRepository = {
  /**
   * Get all cart items for a specific user with product details
   */
  async findByUserId(userId: string): Promise<CartItemWithProduct[]> {
    const results = await db
      .select({
        id: cartItems.id,
        userId: cartItems.userId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
        updatedAt: cartItems.updatedAt,
        product: products,
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));

    return results.map((result) => ({
      id: result.id,
      userId: result.userId,
      productId: result.productId,
      quantity: result.quantity,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      product: result.product as Product,
    }));
  },

  /**
   * Find a specific cart item by user and product
   */
  async findByUserAndProduct(userId: string, productId: number): Promise<CartItem | null> {
    const result = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));
    return result[0] ?? null;
  },

  /**
   * Add item to cart (or update quantity if exists)
   */
  async upsert(data: NewCartItem): Promise<CartItem> {
    const existing = await this.findByUserAndProduct(data.userId, data.productId);

    if (existing) {
      // Update quantity
      const [updated] = await db
        .update(cartItems)
        .set({
          quantity: existing.quantity + (data.quantity || 1),
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }

    // Insert new item
    const [item] = await db.insert(cartItems).values(data).returning();
    return item;
  },

  /**
   * Update cart item quantity
   */
  async updateQuantity(id: number, quantity: number): Promise<CartItem | null> {
    const [item] = await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, id))
      .returning();
    return item ?? null;
  },

  /**
   * Remove item from cart
   */
  async delete(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  },

  /**
   * Clear all cart items for a user (for checkout)
   */
  async clearUserCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  },

  /**
   * Get cart item count for a user
   */
  async getCartCount(userId: string): Promise<number> {
    const result = await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    return result.reduce((sum, item) => sum + item.quantity, 0);
  },
};
