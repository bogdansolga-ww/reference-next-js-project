import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { CartSidebar } from "./cart-sidebar";
import { ProductGrid } from "./product-grid";

export default async function ShopPage() {
  await connection();

  // Require authentication
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Shop</h1>
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Back
          </Link>
        </div>

        <div className="flex gap-6">
          {/* Product Grid - 3/4 width */}
          <div className="flex-1">
            <Suspense fallback={<p className="text-zinc-500">Loading products...</p>}>
              <ProductGrid />
            </Suspense>
          </div>

          {/* Cart Sidebar - 1/4 width */}
          <div className="w-80">
            <Suspense fallback={<div className="h-96 border rounded-lg" />}>
              <CartSidebar />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
