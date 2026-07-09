'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, User, Search, Store, Heart, Bell, ChevronDown, Menu } from 'lucide-react';

export default function Navbar() {
  const { cart, wishlist, cartTotal } = useCart();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="flex flex-col relative z-50 sticky top-0">


      {/* Main Header */}
      <header className="bg-white/85 backdrop-blur-xl border-b border-[var(--border-color)] shadow-sm relative z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-6 lg:gap-12">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-color)] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Store size={22} color="white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-[var(--text-main)] hidden sm:block">
                LUMINA
              </span>
            </Link>

            {/* Powerful Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl relative group">
              <input 
                type="text" 
                placeholder="Search products, brands, categories..." 
                className="w-full pl-12 pr-32 py-3 rounded-full bg-[var(--bg-color)] border border-[var(--border-color)] focus:bg-white focus:border-[var(--primary-color)] focus:ring-4 focus:ring-[rgba(37,99,235,0.1)] transition-all text-sm outline-none"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-[var(--primary-color)] text-white px-5 rounded-full text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors">
                Search
              </button>
            </div>

            {/* Nav Actions */}
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link href="/wishlist" className="p-2.5 text-[var(--text-muted)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-surface-hover)] rounded-full transition-all relative hidden sm:block" aria-label="Wishlist">
                <Heart size={22} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              
              <Link href="#" className="p-2.5 text-[var(--text-muted)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-surface-hover)] rounded-full transition-all relative hidden sm:block">
                <Bell size={22} />
                <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[var(--accent-color)]"></span>
              </Link>

              <div className="w-px h-6 bg-[var(--border-color)] hidden sm:block mx-1"></div>

              <Link href="/cart" className="relative p-2.5 text-[var(--text-main)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-surface-hover)] rounded-full transition-all group flex items-center gap-2">
                <div className="relative">
                  <ShoppingCart size={22} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary-color)] text-[10px] font-bold text-white border-2 border-white">
                      {totalItems}
                    </span>
                  )}
                </div>
                <div className="hidden lg:flex flex-col items-start ml-1">
                  <span className="text-[10px] text-muted leading-tight">My Cart</span>
                  <span className="text-sm font-bold leading-tight">${cartTotal.toFixed(2)}</span>
                </div>
              </Link>

              <Link href="/auth/login" className="flex items-center gap-2 p-2 sm:px-4 sm:py-2.5 rounded-full hover:bg-[var(--bg-surface-hover)] transition-all border border-transparent hover:border-[var(--border-color)] cursor-pointer">
                <User size={20} className="text-[var(--text-main)]" />
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-[10px] text-muted leading-tight">Hello, Sign In</span>
                  <span className="text-sm font-bold leading-tight flex items-center gap-1">My Account <ChevronDown size={12}/></span>
                </div>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Bottom Navigation (Mega Menu Trigger Area) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[var(--border-color)] hidden md:block">
        <div className="container flex items-center gap-8 py-3">
          <button className="flex items-center gap-2 bg-[var(--primary-color)] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[var(--primary-hover)] transition-colors">
            <Menu size={18} /> All Categories
          </button>
          
          <nav className="flex items-center gap-6 flex-1 text-sm font-medium text-[var(--text-main)]">
            <Link href="/products?category=deals" className="hover:text-[var(--primary-color)] transition-colors flex items-center gap-1 text-[var(--danger)]">
               Top Deals
            </Link>
            <Link href="/products?category=electronics" className="hover:text-[var(--primary-color)] transition-colors">Electronics</Link>
            <Link href="/products?category=smart-home" className="hover:text-[var(--primary-color)] transition-colors">Smart Home</Link>
            <Link href="/products?category=laptops" className="hover:text-[var(--primary-color)] transition-colors">Laptops</Link>
            <Link href="/vendor/register" className="hover:text-[var(--primary-color)] transition-colors">Become a Vendor</Link>
          </nav>
          
          <div className="text-sm font-medium flex items-center gap-2 text-muted">
             Need Help? <a href="tel:1-800-123-4567" className="text-[var(--primary-color)] font-bold">1-800-LUMINA</a>
          </div>
        </div>
      </div>
    </div>
  );
}
