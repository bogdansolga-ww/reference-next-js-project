"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface AddToCartButtonProps {
  productId: number;
  productName: string;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleAddToCart() {
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/v1/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to add to cart");
        return;
      }

      // Show success feedback
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);

      // Refresh to update cart
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
      onClick={handleAddToCart}
      disabled={loading || success}
      className="w-full py-2 px-4 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
    >
      {success ? "Added ✓" : loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
