"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CheckoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);

    try {
      const res = await fetch("/api/v1/cart", {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Checkout failed");
        return;
      }

      // Show success message
      alert("Order placed successfully! (This is a fake checkout)");
      router.refresh();
    } catch (_error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-semibold"
    >
      {loading ? "Processing..." : "Checkout"}
    </button>
  );
}
