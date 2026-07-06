import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border-color)] bg-white pt-20 pb-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              LUMINA.
            </Link>
            <p className="text-sm text-muted mb-6">
              The premier destination for cutting-edge electronics and smart gadgets. Curated quality from global vendors.
            </p>
            <h4 className="text-sm font-semibold mb-3">Subscribe to our newsletter</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="Email address" className="bg-[var(--bg-color)] border border-[var(--border-color)] text-sm py-2.5 px-4 rounded-lg flex-1 outline-none focus:border-[var(--primary-color)]" />
              <button className="bg-[var(--primary-color)] text-white px-5 py-2.5 text-sm font-bold rounded-lg hover:bg-[var(--primary-hover)] transition-colors">Subscribe</button>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-base font-semibold mb-6">Shop</h4>
            <ul className="flex flex-col gap-3.5 text-sm text-muted">
              <li><Link href="/products" className="hover:text-[var(--primary-color)] transition-colors">All Products</Link></li>
              <li><Link href="/products?category=audio" className="hover:text-[var(--primary-color)] transition-colors">Audio & Headphones</Link></li>
              <li><Link href="/products?category=displays" className="hover:text-[var(--primary-color)] transition-colors">Monitors & Displays</Link></li>
              <li><Link href="/products?category=wearables" className="hover:text-[var(--primary-color)] transition-colors">Wearable Tech</Link></li>
              <li><Link href="/products?category=phones" className="hover:text-[var(--primary-color)] transition-colors">Smartphones</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-base font-semibold mb-6">Support</h4>
            <ul className="flex flex-col gap-3.5 text-sm text-muted">
              <li><Link href="#" className="hover:text-[var(--primary-color)] transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-[var(--primary-color)] transition-colors">Track Your Order</Link></li>
              <li><Link href="#" className="hover:text-[var(--primary-color)] transition-colors">Returns & Refunds</Link></li>
              <li><Link href="#" className="hover:text-[var(--primary-color)] transition-colors">Shipping Information</Link></li>
              <li><Link href="#" className="hover:text-[var(--primary-color)] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Vendors Links */}
          <div>
            <h4 className="text-base font-semibold mb-6">Vendors</h4>
            <ul className="flex flex-col gap-3.5 text-sm text-muted">
              <li><Link href="/vendor/register" className="hover:text-[var(--primary-color)] transition-colors">Become a Vendor</Link></li>
              <li><Link href="/vendor/dashboard" className="hover:text-[var(--primary-color)] transition-colors">Vendor Dashboard</Link></li>
              <li><Link href="#" className="hover:text-[var(--primary-color)] transition-colors">Seller Policies</Link></li>
              <li><Link href="#" className="hover:text-[var(--primary-color)] transition-colors">Fees & Pricing</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[var(--border-color)] text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} Lumina Marketplace. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-[var(--primary-color)] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[var(--primary-color)] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
