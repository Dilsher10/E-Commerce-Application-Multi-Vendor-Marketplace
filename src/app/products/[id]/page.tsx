'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, ShieldCheck, Truck, ArrowLeft, Minus, Plus, ShoppingCart, Heart, Info, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  stock: number;
  vendor?: {
    _id?: string;
    name?: string;
    vendorDetails?: {
      storeName?: string;
    };
  };
};

export default function ProductDetails() {
  const params = useParams<{ id: string }>();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();

        if (response.ok) {
          setProduct(data.product);
        }
      } catch {
        console.error('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleQuantity = (action: 'increase' | 'decrease') => {
    if (action === 'increase' && product && quantity < product.stock) setQuantity(q => q + 1);
    if (action === 'decrease' && quantity > 1) setQuantity(q => q - 1);
  };

  if (loading) {
    return (
      <div className="bg-[var(--bg-color)] min-h-screen py-8 animate-fade-in">
        <div className="container">
          <div className="bg-white rounded-3xl border border-[var(--border-color)] p-12 text-center">
            <div className="loader mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[var(--bg-color)] min-h-screen py-8 animate-fade-in">
        <div className="container">
          <div className="bg-white rounded-3xl border border-[var(--border-color)] p-12 text-center">
            <h1 className="text-2xl font-bold mb-3">Product not found</h1>
            <p className="text-muted mb-6">This product is unavailable or no longer active.</p>
            <Link href="/products" className="btn btn-primary px-6 py-3 rounded-full font-semibold">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [];
  const vendorName = product.vendor?.vendorDetails?.storeName || product.vendor?.name || 'Verified vendor';
  const wishlisted = isWishlisted(product._id);

  return (
    <div className="bg-[var(--bg-color)] min-h-screen py-8 animate-fade-in">
      <div className="container">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-8 font-medium">
          <Link href="/" className="hover:text-[var(--primary-color)] transition-colors flex items-center gap-1"><ArrowLeft size={14}/> Home</Link>
          <span>/</span>
          <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[var(--primary-color)] transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-[var(--text-main)] truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Product Top Section */}
        <div className="bg-white rounded-3xl border border-[var(--border-color)] shadow-sm overflow-hidden flex flex-col lg:flex-row mb-12">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-1/2 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-[var(--border-color)] bg-gray-50/50">
            <div className="aspect-square bg-white rounded-2xl border border-[var(--border-color)] overflow-hidden mb-4 shadow-sm relative">
              {images[activeImage] ? (
                <img 
                  src={images[activeImage]} 
                  alt={product.title} 
                  className="w-full h-full object-contain p-8 mix-blend-multiply transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-semibold">
                  No Image
                </div>
              )}
            </div>
            
            {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-xl border-2 overflow-hidden bg-white ${activeImage === i ? 'border-[var(--primary-color)] shadow-md' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col">
            <div className="mb-2 text-sm font-bold text-[var(--primary-color)] flex items-center gap-1 uppercase tracking-wider">
               Sold by: <span>{vendorName}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)] mb-4 leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg border border-yellow-200">
                <Star size={16} fill="#ca8a04" stroke="#ca8a04" />
                <span className="font-bold text-sm">Active listing</span>
              </div>
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="mb-6 flex items-end gap-3">
              <span className="text-4xl font-black text-[var(--text-main)]">${product.price.toFixed(2)}</span>
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

                <button
                  disabled={product.stock === 0}
                  onClick={() =>
                    addToCart({
                      product: product._id,
                      title: product.title,
                      price: product.price,
                      image: images[0],
                      vendor: product.vendor?._id || '',
                      quantity,
                    })
                  }
                  className="addToCartBtn flex-1 text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none transition-colors shadow-lg shadow-blue-500/30"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                
                <button
                  type="button"
                  onClick={() => toggleWishlist(product._id)}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-pressed={wishlisted}
                  className={`w-14 h-14 border rounded-xl flex items-center justify-center transition-colors shadow-sm ${
                    wishlisted
                      ? 'bg-red-50 text-red-500 border-red-200'
                      : 'bg-white text-gray-400 border-[var(--border-color)] hover:text-red-500 hover:border-red-200 hover:bg-red-50'
                  }`}
                >
                  <Heart size={22} fill={wishlisted ? 'currentColor' : 'none'} />
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
            <Info className="text-[var(--primary-color)]" /> Product Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {[
              `Category: ${product.category}`,
              `Sold by: ${vendorName}`,
              product.stock > 0 ? `${product.stock} units available` : 'Currently out of stock',
            ].map((feature, idx) => (
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
