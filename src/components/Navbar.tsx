'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="navbar glass">
      <div className="container">
        <Link href="/" className="nav-link" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
          LUMINA.
        </Link>
        <nav className="nav-links">
          <Link href="/products" className="nav-link">Discover</Link>
          <Link href="/vendor/dashboard" className="nav-link">Vendor Area</Link>
          <Link href="/cart" className="btn btn-secondary relative">
            Cart
            {mounted && totalItems > 0 && (
              <span 
                className="absolute" 
                style={{ 
                  top: '-8px', right: '-8px', 
                  background: 'var(--primary-color)', 
                  color: 'white', 
                  borderRadius: '50%', 
                  padding: '2px 6px', 
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>
          <Link href="/auth/login" className="btn btn-primary">
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
