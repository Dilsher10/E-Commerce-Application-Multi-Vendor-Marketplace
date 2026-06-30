'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Search, SlidersHorizontal, Star, ShoppingBag, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-[var(--bg-color)] min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="bg-white border-b border-[var(--border-color)]">
        <div className="container py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">All Products</h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-muted">Showing {products.length} results</p>
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-medium flex-1 sm:flex-none">
                Sort by: Featured <ChevronDown size={16} className="text-muted" />
              </button>
              <button className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-[var(--bg-surface-hover)] border border-[var(--border-color)] rounded-lg text-sm font-medium">
                <SlidersHorizontal size={16} /> Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="glass-card bg-white sticky top-24 p-6">
              <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b border-[var(--border-color)]">
                <SlidersHorizontal size={20} /> Filters
              </div>
              
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Categories</h3>
                <div className="flex flex-col gap-3">
                  {['Audio & Headphones', 'Smartphones', 'Laptops & Computers', 'Smart Home', 'Wearables'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                      <span className="text-sm text-[var(--text-main)] group-hover:text-[var(--primary-color)] transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Price Range</h3>
                <div className="flex gap-2 items-center">
                  <input type="text" placeholder="Min" className="w-full text-sm py-2 px-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md" />
                  <span className="text-muted">-</span>
                  <input type="text" placeholder="Max" className="w-full text-sm py-2 px-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md" />
                </div>
                <button className="w-full mt-4 btn btn-secondary text-sm py-2">Apply</button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-[var(--border-color)]">
                <div className="loader"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[var(--border-color)] p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[var(--bg-color)] rounded-full flex items-center justify-center mb-4 text-muted">
                  <Search size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-muted mb-6">We couldnt find any products matching your current filters.</p>
                <button className="btn btn-primary px-6 py-2">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <div key={product._id} className="glass-card p-0 overflow-hidden group flex flex-col bg-white">
                    <Link href={`/products/${product._id}`} className="relative h-56 overflow-hidden bg-[var(--bg-surface-hover)] block">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex justify-center items-center bg-gray-100 text-gray-400">
                          No Image
                        </div>
                      )}
                    </Link>
                    
                    <div className="p-5 flex flex-col flex-grow">
                      <Link href={`/products/${product._id}`} className="text-base font-semibold line-clamp-2 mb-2 hover:text-[var(--primary-color)] transition-colors">
                        {product.title}
                      </Link>
                      
                      <div className="flex items-center justify-between mb-4 mt-auto">
                        <div className="flex items-center gap-1">
                          <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                          <span className="text-sm font-medium">4.5</span>
                        </div>
                        <span className="text-xs text-muted truncate max-w-[100px]">By {product.vendor?.vendorDetails?.storeName || 'Vendor'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-[var(--border-color)]">
                        <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                        <button 
                          onClick={() => addToCart({
                            product: product._id,
                            title: product.title,
                            price: product.price,
                            image: product.images?.[0],
                            vendor: product.vendor?._id,
                            quantity: 1
                          })}
                          className="w-10 h-10 rounded-full bg-[var(--bg-color)] flex items-center justify-center hover:bg-[var(--primary-color)] hover:text-white text-[var(--text-main)] transition-colors border border-[var(--border-color)]"
                        >
                          <ShoppingBag size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
