import { z } from "zod";

// Request DTOs
export const addToCartSchema = z.object({
  productId: z.number().int().positive("Product ID is required"),
  quantity: z.number().int().positive("Quantity must be at least 1").default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

// Response DTOs
export const cartItemResponseSchema = z.object({
  id: z.number(),
  productId: z.number(),
  productName: z.string(),
  productPrice: z.number(),
  quantity: z.number(),
  subtotal: z.number(),
});

export const cartSummaryResponseSchema = z.object({
  items: z.array(cartItemResponseSchema),
  total: z.number(),
  itemCount: z.number(),
});

export type AddToCartDto = z.infer<typeof addToCartSchema>;
export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>;
export type CartItemResponse = z.infer<typeof cartItemResponseSchema>;
export type CartSummaryResponse = z.infer<typeof cartSummaryResponseSchema>;
