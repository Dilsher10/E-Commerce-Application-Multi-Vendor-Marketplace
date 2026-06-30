'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/auth/login';
        return;
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container py-16">
      <h1 className="mb-8">Your Cart</h1>
      
      {error && <div className="mb-4 p-3 rounded bg-danger" style={{ color: 'white' }}>{error}</div>}

      {cart.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <p className="text-muted mb-4">Your cart is empty.</p>
          <Link href="/products" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map((item) => (
              <div key={item.product} className="glass-card flex gap-4 items-center" style={{ padding: '1rem' }}>
                {item.image ? (
                  <img src={item.image} alt={item.title} className="rounded object-cover" style={{ width: '100px', height: '100px' }} />
                ) : (
                  <div className="rounded bg-surface-hover flex justify-center items-center" style={{ width: '100px', height: '100px' }}>No Img</div>
                )}
                
                <div className="flex-1">
                  <h4>{item.title}</h4>
                  <p className="text-primary font-bold">${item.price}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}
                    >
                      +
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.product)} className="text-danger">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="glass-card sticky" style={{ top: '6rem' }}>
              <h3>Order Summary</h3>
              <div className="flex justify-between py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span>Subtotal</span>
                <span className="font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="py-4">
                <button 
                  onClick={handleCheckout} 
                  className="btn btn-primary w-full" 
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Checkout $${cartTotal.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
