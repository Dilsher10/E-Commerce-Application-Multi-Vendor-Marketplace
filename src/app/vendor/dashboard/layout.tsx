import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Bell, Store, BarChart, Wallet } from 'lucide-react';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[var(--bg-color)] overflow-hidden">
      {/* Vendor Sidebar */}
      <aside className="w-64 bg-white border-r border-[var(--border-color)] flex flex-col hidden md:flex flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-color)]">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)] flex items-center justify-center shadow-sm">
              <Store size={18} color="white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[var(--text-main)]">
              LUMINA
            </span>
          </Link>
          <span className="ml-2 text-xs bg-[var(--accent-color)]/10 text-[var(--accent-color)] px-2 py-0.5 rounded font-bold uppercase">Vendor</span>
        </div>
        
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <img src="https://ui-avatars.com/api/?name=Tech+Haven&background=14B8A6&color=fff" alt="Vendor Store" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
            <div>
              <p className="font-bold text-[var(--text-main)] leading-tight">Tech Haven Ltd.</p>
              <p className="text-xs text-muted">Verified Seller</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 flex flex-col gap-1">
          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 px-2">Store Management</p>
          <Link href="/vendor/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--accent-color)] text-white font-medium shadow-sm transition-colors">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/vendor/dashboard/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-[var(--accent-color)] hover:bg-teal-50 transition-colors font-medium">
            <Package size={20} />
            My Products
          </Link>
          <Link href="/vendor/dashboard/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-[var(--accent-color)] hover:bg-teal-50 transition-colors font-medium">
            <ShoppingCart size={20} />
            Orders
            <span className="ml-auto bg-[var(--accent-color)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
          </Link>
          <Link href="/vendor/dashboard/earnings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-[var(--accent-color)] hover:bg-teal-50 transition-colors font-medium">
            <Wallet size={20} />
            Earnings
          </Link>
          <Link href="/vendor/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-[var(--accent-color)] hover:bg-teal-50 transition-colors font-medium">
            <BarChart size={20} />
            Analytics
          </Link>
          
          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 px-2 mt-6">Settings</p>
          <Link href="/vendor/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-[var(--accent-color)] hover:bg-teal-50 transition-colors font-medium">
            <Settings size={20} />
            Store Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-[var(--border-color)]">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--danger)] hover:bg-red-50 w-full transition-colors font-medium">
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[var(--border-color)] flex items-center justify-between px-4 sm:px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-500 hover:text-[var(--text-main)]">
              <MenuIcon />
            </button>
            <h2 className="font-bold text-lg hidden sm:block">Seller Central</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-semibold text-[var(--accent-color)] hover:underline hidden sm:block">View Live Store</Link>
            <div className="w-px h-6 bg-[var(--border-color)] hidden sm:block"></div>
            <button className="relative text-gray-500 hover:text-[var(--text-main)] transition-colors">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[var(--danger)]"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[var(--bg-color)]">
          {children}
        </main>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
  );
}
