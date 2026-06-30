'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Check, Package, Truck, ArrowRight, Receipt, MapPin, Sparkles } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    if (!cleared) {
      clearCart();
      setCleared(true);
      setOrderId(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
      
      const date = new Date();
      setCurrentDate(date.toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      }));
    }
  }, [clearCart, cleared]);

  return (
    <div className="container py-16 flex justify-center items-center" style={{ minHeight: '85vh', position: 'relative' }}>
      
      <style jsx>{`
        .success-circle {
          animation: scaleUpBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .reveal-up {
          opacity: 0;
          animation: slideUpFade 0.6s ease forwards;
        }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }

        @keyframes scaleUpBounce {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUpFade {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .progress-step {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          z-index: 1;
        }
        .progress-line {
          position: absolute;
          top: 1.25rem;
          left: 50%;
          width: 100%;
          height: 2px;
          background: var(--border-color);
          z-index: 0;
        }
        .progress-line.active {
          background: linear-gradient(90deg, var(--success), var(--border-color));
        }
        .step-icon-wrapper {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-surface);
          border: 2px solid var(--border-color);
          z-index: 2;
          transition: var(--transition);
        }
        .step-active .step-icon-wrapper {
          background: rgba(16, 185, 129, 0.15);
          border-color: var(--success);
          color: var(--success);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
        }
      `}</style>

      <div className="glass-card w-full max-w-2xl overflow-hidden relative" style={{ padding: 0 }}>
        
        {/* Top Header Section */}
        <div className="text-center pt-12 pb-8 px-8 border-b border-[var(--border-color)] relative">
          <div className="absolute top-4 right-4 text-[var(--success)] opacity-20">
            <Sparkles size={48} />
          </div>
          
          <div className="mb-6 flex justify-center">
            <div className="success-circle rounded-full bg-success flex justify-center items-center shadow-lg" 
                 style={{ width: '88px', height: '88px', boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}>
              <Check strokeWidth={3} stroke="white" style={{ width: '44px', height: '44px' }} />
            </div>
          </div>
          
          <h1 className="reveal-up mb-3" style={{ fontSize: '2.5rem', background: 'none', WebkitTextFillColor: 'initial', color: 'var(--text-main)' }}>
            Payment Successful!
          </h1>
          <p className="text-muted reveal-up delay-1 text-lg mb-2">
            Thank you for shopping with us. Your order has been placed.
          </p>
          <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--bg-color)] border border-[var(--border-color)] text-sm font-mono reveal-up delay-1 mt-2 text-[var(--primary-color)]">
            Order #{orderId}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="px-8 py-8 bg-[var(--bg-surface-hover)] reveal-up delay-2">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)]">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm text-muted font-semibold uppercase tracking-wider mb-1">Delivery Address</p>
                <p className="text-[var(--text-main)] text-sm">
                  123 Innovation Drive<br/>
                  Suite 400<br/>
                  Tech City, TC 94016
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)]">
                <Receipt size={24} />
              </div>
              <div>
                <p className="text-sm text-muted font-semibold uppercase tracking-wider mb-1">Order Date</p>
                <p className="text-[var(--text-main)] text-sm">{currentDate}</p>
                <Link href="#" className="text-[var(--primary-color)] text-sm font-medium hover:underline flex items-center gap-1 mt-2">
                  View Receipt <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="flex justify-between relative mt-10 mb-4 px-4">
            <div className="progress-line active"></div>
            
            <div className="progress-step step-active w-1/3">
              <div className="step-icon-wrapper">
                <Receipt size={20} />
              </div>
              <span className="text-xs font-semibold text-[var(--success)] mt-2 uppercase tracking-wide">Placed</span>
            </div>
            
            <div className="progress-step w-1/3">
              <div className="step-icon-wrapper text-[var(--text-muted)]">
                <Package size={20} />
              </div>
              <span className="text-xs font-medium text-muted mt-2 uppercase tracking-wide">Processing</span>
            </div>
            
            <div className="progress-step w-1/3">
              <div className="step-icon-wrapper text-[var(--text-muted)] bg-[var(--bg-color)]">
                <Truck size={20} />
              </div>
              <span className="text-xs font-medium text-muted mt-2 uppercase tracking-wide">Shipped</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 flex gap-4 justify-center items-center border-t border-[var(--border-color)] bg-[var(--bg-surface)] reveal-up delay-3">
          <Link href="/products" className="btn btn-secondary flex-1 py-3" style={{ fontSize: '1.05rem' }}>
            Continue Shopping
          </Link>
          <Link href="/orders" className="btn btn-primary flex-1 py-3 border border-transparent" style={{ fontSize: '1.05rem', boxShadow: '0 4px 20px rgba(99,102,241,0.2)' }}>
            Track Order Details
          </Link>
        </div>

      </div>
    </div>
  );
}
