'use client';

import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Wallet } from 'lucide-react';
import { usePathname } from 'next/navigation';

const vendorNavItems = [
  { href: '/vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/vendor/products', label: 'My Products', icon: Package },
  { href: '/vendor/orders', label: 'Orders', icon: ShoppingCart, badge: '3' },
  { href: '/vendor/earnings', label: 'Earnings', icon: Wallet },
];

function isActivePath(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function VendorSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto px-4 flex flex-col gap-1">
      <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 px-2">Store Management</p>
      {vendorNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = isActivePath(pathname, item.href, item.exact);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive ? 'bg-[#2563eb] text-white shadow-sm' : 'text-gray-600 hover:text-[#2563eb] hover:bg-blue-50'
            }`}
          >
            <Icon size={20} />
            {item.label}
            {item.badge && (
              <span className="ml-auto bg-[#2563eb] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
