import { getSession } from "@/lib/auth";
import { cartService } from "@/lib/services/cartService";
import { CartItemRow } from "./cart-item-row";
import { CheckoutButton } from "./checkout-button";

export async function CartSidebar() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const cart = await cartService.getUserCart(session.user.id);

  return (
    <div className="border rounded-lg p-4 dark:border-zinc-700 sticky top-8">
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

      {cart.items.length === 0 ? (
        <p className="text-zinc-500 text-center py-8">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
            {cart.items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          {/* Cart Total */}
          <div className="border-t dark:border-zinc-700 pt-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-zinc-600 dark:text-zinc-400">Items:</span>
              <span className="font-semibold">{cart.itemCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">${cart.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <CheckoutButton />
        </>
      )}
    </div>
  );
}
