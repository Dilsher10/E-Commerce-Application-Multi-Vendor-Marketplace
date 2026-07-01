'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, Truck, ArrowLeft, Minus, Plus, ShoppingCart, Heart, Share2, Info } from 'lucide-react';

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Mock product data
  const product = {
    id: 'PRD-001',
    name: 'Quantum Pro Wireless Noise-Canceling Earbuds',
    vendor: 'Audio Dynamics',
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviews: 124,
    description: 'Experience studio-quality sound with our next-generation wireless earbuds. Featuring active noise cancellation, 30-hour battery life, and crystal-clear calls thanks to our custom beamforming microphones.',
    features: [
      'Active Noise Cancellation (ANC)',
      'Up to 30 hours of battery life with case',
      'IPX4 water and sweat resistance',
      'Bluetooth 5.3 for seamless connectivity',
      'Custom EQ via companion app'
    ],
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572569438062-cba6eb324a30?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=800&auto=format&fit=crop'
    ]
  };

  const handleQuantity = (action: 'increase' | 'decrease') => {
    if (action === 'increase' && quantity < 10) setQuantity(q => q + 1);
    if (action === 'decrease' && quantity > 1) setQuantity(q => q - 1);
  };

  return (
    <div className="bg-[var(--bg-color)] min-h-screen py-8 animate-fade-in">
      <div className="container">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-8 font-medium">
          <Link href="/" className="hover:text-[var(--primary-color)] transition-colors flex items-center gap-1"><ArrowLeft size={14}/> Home</Link>
          <span>/</span>
          <Link href="/products?category=audio" className="hover:text-[var(--primary-color)] transition-colors">Audio</Link>
          <span>/</span>
          <span className="text-[var(--text-main)] truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Top Section */}
        <div className="bg-white rounded-3xl border border-[var(--border-color)] shadow-sm overflow-hidden flex flex-col lg:flex-row mb-12">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-1/2 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-[var(--border-color)] bg-gray-50/50">
            <div className="aspect-square bg-white rounded-2xl border border-[var(--border-color)] overflow-hidden mb-4 shadow-sm relative">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-contain p-8 mix-blend-multiply transition-opacity duration-300"
              />
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Save 25%
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-xl border-2 overflow-hidden bg-white ${activeImage === i ? 'border-[var(--primary-color)] shadow-md' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col">
            <div className="mb-2 text-sm font-bold text-[var(--primary-color)] flex items-center gap-1 uppercase tracking-wider">
               Sold by: <Link href="#" className="hover:underline">{product.vendor}</Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)] mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg border border-yellow-200">
                <Star size={16} fill="#ca8a04" stroke="#ca8a04" />
                <span className="font-bold text-sm">{product.rating}</span>
              </div>
              <span className="text-sm font-medium text-[var(--primary-color)] hover:underline cursor-pointer">
                See all {product.reviews} reviews
              </span>
            </div>

            <div className="mb-6 flex items-end gap-3">
              <span className="text-4xl font-black text-[var(--text-main)]">${product.price.toFixed(2)}</span>
              <span className="text-lg text-muted line-through mb-1">${product.originalPrice.toFixed(2)}</span>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Actions */}
            <div className="mt-auto border-t border-[var(--border-color)] pt-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                
                <div className="flex items-center bg-gray-50 border border-[var(--border-color)] rounded-xl overflow-hidden h-14">
                  <button onClick={() => handleQuantity('decrease')} className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-black transition-colors">
                    <Minus size={18} />
                  </button>
                  <div className="w-12 h-full flex items-center justify-center font-bold text-lg bg-white border-l border-r border-[var(--border-color)]">
                    {quantity}
                  </div>
                  <button onClick={() => handleQuantity('increase')} className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-black transition-colors">
                    <Plus size={18} />
                  </button>
                </div>

                <button className="flex-1 bg-[var(--primary-color)] text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--primary-hover)] transition-colors shadow-lg shadow-blue-500/30">
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                
                <button className="w-14 h-14 border border-[var(--border-color)] bg-white rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm">
                  <Heart size={22} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-green-50 text-green-800 p-4 rounded-xl border border-green-200">
                  <Truck size={24} strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-bold">Free Shipping</p>
                    <p className="text-xs">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-200">
                  <ShieldCheck size={24} strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-bold">1 Year Warranty</p>
                    <p className="text-xs">Guaranteed quality</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Details Section */}
        <div className="bg-white rounded-3xl border border-[var(--border-color)] shadow-sm p-6 md:p-10 mb-20">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Info className="text-[var(--primary-color)]" /> Product Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 border-b border-[var(--border-color)] pb-4">
                <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
