'use client';

import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

type ProductActionData = {
  id: string;
  title: string;
  price: number;
  image?: string;
  vendorId?: string;
  stock: number;
};

export default function ProductCardActions({ product }: { product: ProductActionData }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const wishlisted = isWishlisted(product.id);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={wishlisted}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border shadow-sm ${
          wishlisted
            ? 'bg-red-50 text-red-500 border-red-200'
            : 'bg-[var(--bg-color)] text-[var(--text-main)] border-[var(--border-color)] hover:bg-red-50 hover:text-red-500 hover:border-red-200'
        }`}
      >
        <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      <button
        type="button"
        disabled={isOutOfStock}
        onClick={() =>
          addToCart({
            product: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            vendor: product.vendorId || '',
            quantity: 1,
          })
        }
        aria-label={isOutOfStock ? 'Out of stock' : 'Add to cart'}
        className="w-10 h-10 rounded-full bg-[var(--bg-color)] flex items-center justify-center hover:bg-[var(--primary-color)] hover:text-white text-[var(--text-main)] transition-colors border border-[var(--border-color)] shadow-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-gray-100"
      >
        <ShoppingBag size={18} />
      </button>
    </div>
  );
}
