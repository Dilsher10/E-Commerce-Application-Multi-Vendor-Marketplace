import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lumina - Multi-Vendor Marketplace',
  description: 'A premium, modern multi-vendor marketplace.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />

          <main>{children}</main>

          <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', padding: '2rem 0', background: 'var(--bg-surface)' }}>
            <div className="container text-center">
              <p>&copy; {new Date().getFullYear()} Lumina Marketplace. All rights reserved.</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
