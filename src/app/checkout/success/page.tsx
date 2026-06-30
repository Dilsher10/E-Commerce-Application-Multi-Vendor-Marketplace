'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared) {
      clearCart();
      setCleared(true);
    }
  }, [clearCart, cleared]);

  return (
    <div className="container py-24 flex justify-center items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-card text-center max-w-lg w-full animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-success flex justify-center items-center" style={{ width: '80px', height: '80px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" style={{ width: '40px', height: '40px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>
        <h2 className="mb-4">Payment Successful!</h2>
        <p className="text-muted mb-8">
          Thank you for your order. We are processing it and will notify the vendors shortly.
        </p>
        <Link href="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
