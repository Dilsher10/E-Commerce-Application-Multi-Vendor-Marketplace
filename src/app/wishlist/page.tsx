'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

type Product = {
  _id: string;
  title: string;
  price: number;
  category: string;
  images?: string[];
  stock: number;
  vendor?: {
    _id?: string;
    vendorDetails?: {
      storeName?: string;
    };
  };
};

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products || []);
        }
      } catch {
        console.error('Failed to fetch wishlist products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const wishlistProducts = useMemo(
    () => products.filter((product) => wishlist.includes(product._id)),
    [products, wishlist]
  );

  return (
    <div className="bg-[var(--bg-color)] min-h-screen pb-16">
      <div className="bg-white border-b border-[var(--border-color)]">
        <div className="container py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-3">
            <Heart className="text-red-500" fill="currentColor" /> Wishlist
          </h1>
          <p className="text-muted">Saved products stay on this device.</p>
        </div>
      </div>

      <div className="container mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-[var(--border-color)]">
            <div className="loader"></div>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--border-color)] p-12 text-center">
            <Heart size={32} className="mx-auto text-muted mb-4" />
            <h2 className="text-2xl font-bold mb-2">No saved products yet</h2>
            <p className="text-muted mb-6">Tap the heart on a product to save it here.</p>
            <Link href="/products" className="btn btn-primary px-6 py-3 rounded-full font-semibold">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
                <Link href={`/products/${product._id}`} className="h-56 bg-gray-50 p-4 flex items-center justify-center">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-semibold">
                      No Image
                    </div>
                  )}
                </Link>

                <div className="p-5 flex flex-col flex-grow">
                  <Link href={`/products/${product._id}`} className="font-bold line-clamp-2 hover:text-[var(--primary-color)] transition-colors">
                    {product.title}
                  </Link>
                  <p className="text-xs text-muted mt-2 mb-4">{product.vendor?.vendorDetails?.storeName || product.category}</p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                    <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product._id)}
                        className="w-10 h-10 rounded-full bg-red-50 text-red-500 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={17} />
                      </button>
                      <button
                        type="button"
                        disabled={product.stock <= 0}
                        onClick={() =>
                          addToCart({
                            product: product._id,
                            title: product.title,
                            price: product.price,
                            image: product.images?.[0],
                            vendor: product.vendor?._id || '',
                            quantity: 1,
                          })
                        }
                        className="w-10 h-10 rounded-full bg-[var(--bg-color)] text-[var(--text-main)] border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--primary-color)] hover:text-white transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
