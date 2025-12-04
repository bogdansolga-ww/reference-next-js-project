"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CartItemResponse } from "@/lib/types/cart";

interface CartItemRowProps {
  item: CartItemResponse;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateQuantity(newQuantity: number) {
    if (newQuantity < 1) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/cart/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!res.ok) {
        alert("Failed to update quantity");
        return;
      }

      router.refresh();
    } catch (_error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function removeItem() {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/cart/${item.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to remove item");
        return;
      }

      router.refresh();
    } catch (_error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-md p-3 dark:border-zinc-700">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm">{item.productName}</h4>
        <button
          type="button"
          onClick={removeItem}
          disabled={loading}
          className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
          aria-label="Remove item"
        >
          ✕
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateQuantity(item.quantity - 1)}
            disabled={loading || item.quantity <= 1}
            className="w-6 h-6 border rounded dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
          >
            −
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(item.quantity + 1)}
            disabled={loading}
            className="w-6 h-6 border rounded dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
          >
            +
          </button>
        </div>
        <span className="font-semibold">${item.subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
