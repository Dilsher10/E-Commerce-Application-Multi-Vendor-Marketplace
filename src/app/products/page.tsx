'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCardActions from '@/components/ProductCardActions';

type Product = {
  _id: string;
  title: string;
  description?: string;
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

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get('category') || '';
  const activeSort = searchParams.get('sort') || 'newest';
  const hasFilters = Boolean(activeCategory || searchParams.get('minPrice') || searchParams.get('maxPrice') || searchParams.get('sort'));

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim()) {
        params.set(key, value.trim());
      } else {
        params.delete(key);
      }
    });

    router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const applyPriceFilter = () => {
    updateFilters({
      minPrice,
      maxPrice,
    });
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    router.push('/products');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = searchParams.toString();
        const res = await fetch(`/api/products${query ? `?${query}` : ''}`);
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products || []);
          setCategories(data.categories || []);
        }
      } catch {
        console.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  return (
    <div className="bg-[var(--bg-color)] min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="bg-white border-b border-[var(--border-color)]">
        <div className="container py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">All Products</h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-muted">Showing {products.length} results</p>
            <div className="flex gap-3 w-full sm:w-auto">
              <label className="relative flex-1 sm:flex-none">
                <select
                  value={activeSort}
                  onChange={(event) => updateFilters({ sort: event.target.value === 'newest' ? null : event.target.value })}
                  className="appearance-none w-full px-4 py-2 pr-9 bg-white border border-[var(--border-color)] rounded-lg text-sm font-medium outline-none"
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown size={16} className="text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </label>
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
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={activeCategory === cat}
                        onChange={(event) => updateFilters({ category: event.target.checked ? cat : null })}
                        className="w-4 h-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                      />
                      <span className="text-sm text-[var(--text-main)] group-hover:text-[var(--primary-color)] transition-colors">{cat}</span>
                    </label>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-sm text-muted">No categories yet.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Price Range</h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder="Min"
                    className="w-full text-sm py-2 px-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md"
                  />
                  <span className="text-muted">-</span>
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder="Max"
                    className="w-full text-sm py-2 px-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md"
                  />
                </div>
                <button onClick={applyPriceFilter} className="w-full mt-4 btn btn-secondary text-sm py-2">Apply</button>
                {hasFilters && (
                  <button onClick={clearFilters} className="w-full mt-3 text-sm font-semibold text-[var(--primary-color)] hover:underline">
                    Clear Filters
                  </button>
                )}
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
                <p className="text-muted mb-6">We could not find any products matching your current filters.</p>
                <button onClick={clearFilters} className="btn btn-primary px-6 py-2">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
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
                        <ProductCardActions
                          product={{
                            id: product._id,
                            title: product.title,
                            price: product.price,
                            image: product.images?.[0],
                            vendorId: product.vendor?._id,
                            stock: product.stock,
                          }}
                        />
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
