'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  
  // Define routes that should NOT have the global Navbar and Footer
  const isVendorSellerRoute =
    pathname === '/vendor/dashboard' ||
    pathname.startsWith('/vendor/profile') ||
    pathname.startsWith('/vendor/products') ||
    pathname.startsWith('/vendor/orders') ||
    pathname.startsWith('/vendor/earnings');

  const isExcluded = pathname.startsWith('/admin') || isVendorSellerRoute;

  if (isExcluded) {
    return <main className="flex-1 h-screen overflow-hidden">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
