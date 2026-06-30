import Link from 'next/link';
import { ShoppingBag, Zap, Shield, Headphones, Monitor, Watch, Smartphone, Star, ArrowRight, Truck, Gift } from 'lucide-react';

export default function Home() {
  const featuredProducts = [
    { id: 1, name: 'Quantum Pro Wireless Earbuds', price: 149.99, rating: 4.8, reviews: 124, category: 'Audio', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop' },
    { id: 2, name: 'AeroBook Ultra 14" Laptop', price: 1299.00, rating: 4.9, reviews: 89, category: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&auto=format&fit=crop' },
    { id: 3, name: 'Horizon Smartwatch Series 5', price: 299.50, rating: 4.7, reviews: 210, category: 'Wearables', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop' },
    { id: 4, name: 'Nexus 4K Creator Monitor', price: 499.00, rating: 4.6, reviews: 45, category: 'Displays', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop' },
  ];

  const bestSellers = [
    { id: 9, name: 'Echo Plus Smart Speaker', price: 99.99, rating: 4.9, reviews: 3420, category: 'Smart Home', image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=600&auto=format&fit=crop' },
    { id: 10, name: 'ProCam X1 Action Camera', price: 249.00, rating: 4.7, reviews: 890, category: 'Cameras', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop' },
    { id: 11, name: 'Zenith Noise-Canceling Over-Ear', price: 199.50, rating: 4.8, reviews: 1205, category: 'Audio', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop' },
    { id: 12, name: 'NovaLite 10,000mAh Powerbank', price: 39.99, rating: 4.6, reviews: 540, category: 'Accessories', image: 'https://images.unsplash.com/photo-1609091839311-d5365f47d8eb?q=80&w=600&auto=format&fit=crop' },
  ];

  const newArrivals = [
    { id: 5, name: 'Lumina Smart Ring Gen 2', price: 199.99, rating: 4.5, reviews: 32, category: 'Wearables', image: 'https://images.unsplash.com/photo-1599814474771-36f78fec1db7?q=80&w=600&auto=format&fit=crop' },
    { id: 6, name: 'Vortex Mechanical Keyboard', price: 129.50, rating: 4.9, reviews: 156, category: 'Accessories', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop' },
    { id: 7, name: 'Aero 8K Drone w/ Controller', price: 899.00, rating: 4.8, reviews: 41, category: 'Cameras', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=600&auto=format&fit=crop' },
    { id: 8, name: 'SoundScape Desk Speakers', price: 249.99, rating: 4.7, reviews: 89, category: 'Audio', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop' },
  ];

  const categories = [
    { name: 'Audio', icon: Headphones, count: '1,240 items', color: 'bg-blue-100 text-blue-600' },
    { name: 'Displays', icon: Monitor, count: '342 items', color: 'bg-purple-100 text-purple-600' },
    { name: 'Wearables', icon: Watch, count: '590 items', color: 'bg-orange-100 text-orange-600' },
    { name: 'Phones', icon: Smartphone, count: '890 items', color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="animate-fade-in bg-[var(--bg-color)] flex flex-col gap-8 md:gap-16 pb-16">
      {/* Modern Bento Box Hero Section */}
      <section className="pt-10 pb-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[540px]">
            
            {/* Main Bento Block */}
            <div className="md:col-span-2 relative rounded-3xl overflow-hidden bg-white border border-[var(--border-color)] p-10 md:p-16 flex flex-col justify-center h-[420px] md:h-full">
              <div className="absolute top-0 right-0 w-2/3 h-full z-0 opacity-20" style={{ background: 'radial-gradient(circle at 100% 50%, var(--primary-color) 0%, transparent 70%)' }}></div>
              <div className="relative z-10 max-w-lg">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(37,99,235,0.1)] text-[var(--primary-color)] text-xs font-bold uppercase tracking-wider mb-6">
                  <Star size={14} fill="var(--primary-color)" /> Top Rated Marketplace
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-[var(--text-main)] tracking-tight leading-[1.1]">
                  Discover the Best <br/><span className="text-[var(--primary-color)]">Global Brands.</span>
                </h1>
                <p className="text-lg text-muted mb-8 max-w-md">
                  Shop exclusive deals on premium electronics, fashion, and smart home devices from verified vendors worldwide.
                </p>
                <Link href="/products" className="btn btn-primary px-8 py-3 rounded-full text-base font-semibold shadow-lg shadow-blue-500/30">
                  Shop the Collection
                </Link>
              </div>
            </div>

            {/* Side Bento Blocks */}
            <div className="flex flex-col gap-6 h-auto md:h-full">
              
              {/* Promo Bento */}
              <div className="flex-1 rounded-3xl overflow-hidden relative border border-[var(--border-color)] p-8 flex flex-col justify-center min-h-[200px] group bg-[var(--primary-color)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] opacity-90 z-0 group-hover:scale-105 transition-transform duration-700"></div>
                <div className="relative z-10 text-white">
                  <Zap size={32} className="mb-4 text-white" />
                  <h3 className="text-2xl font-bold text-white mb-2">Flash Sale</h3>
                  <p className="text-white/80 mb-4">Up to 40% off on all Audio.</p>
                  <Link href="/products?category=audio" className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all">
                    Shop Now <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Vendors Bento */}
              <div className="flex-1 rounded-3xl overflow-hidden bg-white border border-[var(--border-color)] p-8 flex flex-col justify-center min-h-[200px] relative">
                <div className="absolute -right-6 -bottom-6 opacity-5">
                  <Gift size={150} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Become a Vendor</h3>
                  <p className="text-muted mb-4">Start selling your products to millions of active buyers today.</p>
                  <Link href="/vendor/register" className="text-[var(--primary-color)] font-semibold inline-flex items-center gap-2 hover:underline">
                    Apply Now <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-12 bg-white border border-[var(--border-color)]">
        <div className="container">
          <p className="text-center text-sm font-semibold text-muted uppercase tracking-wider mb-8">Trusted by global leading brands</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Apple', 'Samsung', 'Sony', 'Bose', 'DJI', 'Logitech'].map((brand, i) => (
              <div key={i} className="text-xl md:text-2xl font-black text-[var(--secondary-color)] tracking-tighter">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Categories */}
      <section className="py-14 bg-white border border-[var(--border-color)]">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold m-0">Explore Categories</h2>
            <Link href="/categories" className="text-[var(--primary-color)] font-semibold text-sm hover:underline">See All</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((cat, i) => (
              <Link href={`/products?category=${cat.name.toLowerCase()}`} key={i} className="flex items-center gap-6 p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-color)] hover:bg-white hover:border-[var(--primary-color)] transition-all group shadow-sm hover:shadow-md">
                <div className={`w-16 h-16 rounded-xl ${cat.color} flex items-center justify-center flex-shrink-0`}>
                  <cat.icon size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold m-0 group-hover:text-[var(--primary-color)] transition-colors">{cat.name}</h3>
                  <p className="text-xs text-muted m-0 mt-1">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="py-20 bg-white border border-[var(--border-color)]">
        <div className="container">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Trending Right Now</h2>
              <p className="text-muted">The products everyone is talking about.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-[var(--border-color)] p-0 overflow-hidden group flex flex-col hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-64 overflow-hidden bg-gray-50 p-4 flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[var(--text-main)] text-xs font-bold rounded-full shadow-sm">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-base font-bold line-clamp-2 leading-snug">{product.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                    <span className="text-sm font-bold">{product.rating}</span>
                    <span className="text-xs text-muted">({product.reviews})</span>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-[var(--border-color)]">
                    <span className="text-xl font-extrabold">${product.price.toFixed(2)}</span>
                    <button className="w-10 h-10 rounded-full bg-[var(--bg-color)] flex items-center justify-center hover:bg-[var(--primary-color)] hover:text-white transition-colors border border-[var(--border-color)] shadow-sm">
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Grid */}
      <section className="py-20 bg-white border border-[var(--border-color)]">
        <div className="container">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-3 rounded-full">
                Just Dropped
              </div>
              <h2 className="mb-2 text-3xl font-bold">New Arrivals</h2>
              <p className="text-muted">Discover the latest cutting-edge tech added this week.</p>
            </div>
            <Link href="/products?sort=newest" className="text-[var(--primary-color)] font-medium hover:underline hidden sm:block">View All New Drops</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <div key={product.id} className="bg-[var(--bg-color)] rounded-2xl border border-[var(--border-color)] p-0 overflow-hidden group flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-64 overflow-hidden bg-white p-4 flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[var(--secondary-color)] text-white text-xs font-bold rounded-full shadow-sm">
                      New
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-base font-bold line-clamp-2 leading-snug">{product.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                    <span className="text-sm font-bold">{product.rating}</span>
                    <span className="text-xs text-muted">({product.reviews})</span>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-[var(--border-color)]">
                    <span className="text-xl font-extrabold">${product.price.toFixed(2)}</span>
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[var(--primary-color)] hover:text-white transition-colors border border-[var(--border-color)] shadow-sm">
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-white border border-[var(--border-color)]">
        <div className="container">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Best Sellers</h2>
              <p className="text-muted">Top-rated items loved by thousands of customers.</p>
            </div>
            <Link href="/products?sort=bestselling" className="text-[var(--primary-color)] font-medium hover:underline hidden sm:block">Shop All Best Sellers</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-[var(--border-color)] p-0 overflow-hidden group flex flex-col hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-64 overflow-hidden bg-gray-50 p-4 flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">
                      Hot
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-base font-bold line-clamp-2 leading-snug">{product.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                    <span className="text-sm font-bold">{product.rating}</span>
                    <span className="text-xs text-muted">({product.reviews})</span>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-[var(--border-color)]">
                    <span className="text-xl font-extrabold">${product.price.toFixed(2)}</span>
                    <button className="w-10 h-10 rounded-full bg-[var(--bg-color)] flex items-center justify-center hover:bg-[var(--primary-color)] hover:text-white transition-colors border border-[var(--border-color)] shadow-sm">
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-[var(--secondary-color)] text-white overflow-hidden shadow-2xl">
        <div className="container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">What Our Customers Say</h2>
            <p className="text-gray-300">Don't just take our word for it. Join millions of satisfied buyers globally.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", role: "Verified Buyer", text: "The shipping was incredibly fast, and the laptop was exactly as described. Best marketplace experience I've had in years." },
              { name: "Michael Chen", role: "Tech Enthusiast", text: "I love the variety of verified vendors. Found a rare mechanical keyboard I couldn't find anywhere else!" },
              { name: "Amanda Torres", role: "Verified Buyer", text: "Customer service is top-notch. Had a small issue with a smartwatch delivery and they resolved it within 10 minutes." }
            ].map((review, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 p-10 rounded-3xl relative">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#fbbf24" stroke="#fbbf24" />)}
                </div>
                <p className="text-gray-200 mb-8 italic">"{review.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{review.name}</h4>
                    <p className="text-xs text-gray-400">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download CTA */}
      <section className="py-0 relative overflow-hidden rounded-3xl bg-[var(--primary-color)] mx-4 md:mx-12 my-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-color)] via-[var(--primary-color)] to-transparent opacity-90"></div>
        <div className="container relative z-10 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-white">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white leading-tight">Shop Faster With The Lumina App.</h2>
            <p className="text-blue-100 text-lg mb-8">Get exclusive app-only discounts, real-time tracking, and early access to drops. Available on iOS and Android.</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-gray-800 transition-colors">
                <Smartphone size={24} />
                <div className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-gray-400">Download on the</div>
                  <div className="text-sm leading-tight">App Store</div>
                </div>
              </button>
              <button className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-gray-100 transition-colors">
                <Smartphone size={24} />
                <div className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-gray-500">GET IT ON</div>
                  <div className="text-sm leading-tight">Google Play</div>
                </div>
              </button>
            </div>
          </div>
          <div className="hidden lg:block relative w-64 h-[400px]">
            {/* Abstract mock phone visual */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-[500px] bg-white rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden transform rotate-12">
              <div className="w-full h-full bg-gray-100 relative">
                <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-2xl w-1/2 mx-auto"></div>
                <div className="p-4 pt-10">
                  <div className="h-32 bg-blue-100 rounded-xl mb-4"></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-24 bg-gray-200 rounded-xl"></div>
                    <div className="h-24 bg-gray-200 rounded-xl"></div>
                  </div>
                  <div className="h-10 bg-[var(--primary-color)] rounded-full mb-4 w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white border border-[var(--border-color)]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
            <div className="flex flex-col items-center text-center p-10 md:py-8">
              <Truck size={32} className="text-[var(--primary-color)] mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-bold mb-2">Free Delivery</h3>
              <p className="text-sm text-muted">Enjoy free worldwide shipping on all orders over $50.</p>
            </div>
            <div className="flex flex-col items-center text-center p-10 md:py-8">
              <Shield size={32} className="text-green-500 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-bold mb-2">Secure Checkout</h3>
              <p className="text-sm text-muted">Shop with confidence with our 256-bit encrypted checkout.</p>
            </div>
            <div className="flex flex-col items-center text-center p-10 md:py-8">
              <Star size={32} className="text-orange-500 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-bold mb-2">Quality Guarantee</h3>
              <p className="text-sm text-muted">Every vendor is vetted to ensure premium product quality.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
