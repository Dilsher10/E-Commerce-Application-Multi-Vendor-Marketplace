'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

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
    <div className="container py-16">
      <h1 className="text-center mb-12">Discover Products</h1>
      
      {loading ? (
        <div className="flex justify-center items-center" style={{ height: '50vh' }}>
          <div className="loader"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-muted">No products available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <div key={product._id} className="glass-card flex flex-col" style={{ padding: '0', overflow: 'hidden' }}>
              {product.images?.[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.title} 
                  className="w-full object-cover" 
                  style={{ height: '200px' }} 
                />
              ) : (
                <div 
                  className="w-full bg-surface-hover flex justify-center items-center" 
                  style={{ height: '200px' }}
                >
                  <span className="text-muted">No Image</span>
                </div>
              )}
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="mb-1" style={{ fontSize: '1.25rem' }}>{product.title}</h3>
                <p className="text-muted mb-2 text-sm">By {product.vendor?.vendorDetails?.storeName || product.vendor?.name}</p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="font-bold text-primary" style={{ fontSize: '1.25rem' }}>${product.price}</span>
                  <button 
                    onClick={() => addToCart({
                      product: product._id,
                      title: product.title,
                      price: product.price,
                      image: product.images?.[0],
                      vendor: product.vendor?._id,
                      quantity: 1
                    })}
                    className="btn btn-primary" 
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
