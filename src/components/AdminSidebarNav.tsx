'use client';

import Link from 'next/link';
import { LayoutDashboard, Package, Settings, ShoppingCart, Tags, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, badge: '' },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings, pushBottom: true },
];

function isActivePath(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
      {adminNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = isActivePath(pathname, item.href, item.exact);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive ? 'bg-[#2563eb] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
            } ${item.pushBottom ? 'mt-auto' : ''}`}
          >
            <Icon size={20} />
            {item.label}
            {item.badge && (
              <span className="ml-auto bg-[var(--danger)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
