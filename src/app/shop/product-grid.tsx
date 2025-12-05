import { productService } from "@/lib/services/productService";
import { AddToCartButton } from "./add-to-cart-button";

export async function ProductGrid() {
  const products = await productService.getAllProducts();

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">No products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 dark:border-zinc-700 flex flex-col">
          {/* Product Image Placeholder */}
          <div className="bg-zinc-100 dark:bg-zinc-800 h-48 rounded-md mb-4 flex items-center justify-center">
            <span className="text-zinc-400 text-sm">No image</span>
          </div>

          {/* Product Info */}
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">${product.price.toFixed(2)}</p>

          {/* Add to Cart Button */}
          <AddToCartButton productId={product.id} />
        </div>
      ))}
    </div>
  );
}
