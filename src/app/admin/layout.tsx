import Link from 'next/link';
import { LayoutDashboard, Package, Users, ShoppingCart, Settings, LogOut, Bell, Search, Store } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[var(--bg-color)] overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[var(--secondary-color)] text-white flex flex-col hidden md:flex flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)] flex items-center justify-center shadow-sm">
              <Store size={18} color="white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              LUMINA
            </span>
          </Link>
          <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded font-medium text-white/90">ADMIN</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--primary-color)] text-white font-medium transition-colors">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <Package size={20} />
            Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <ShoppingCart size={20} />
            Orders
            <span className="ml-auto bg-[var(--danger)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">12</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <Users size={20} />
            Users
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors mt-auto">
            <Settings size={20} />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--danger)] hover:bg-white/5 w-full transition-colors font-medium">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Header */}
        <header className="h-16 bg-white border-b border-[var(--border-color)] flex items-center justify-between px-4 sm:px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button className="md:hidden text-gray-500 hover:text-[var(--text-main)]">
              <MenuIcon />
            </button>
            <div className="hidden sm:flex items-center bg-[var(--bg-color)] border border-[var(--border-color)] rounded-full px-4 py-2 w-full max-w-md focus-within:border-[var(--primary-color)] transition-colors">
              <Search size={18} className="text-muted mr-2" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none w-full text-sm text-[var(--text-main)]"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button className="relative text-gray-500 hover:text-[var(--text-main)] transition-colors">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[var(--danger)]"></span>
            </button>
            <div className="w-px h-6 bg-[var(--border-color)]"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=2563EB&color=fff" alt="Admin" className="w-9 h-9 rounded-full object-cover border-2 border-transparent group-hover:border-[var(--primary-color)] transition-all" />
              <div className="hidden md:block text-sm">
                <p className="font-bold text-[var(--text-main)] leading-tight">Admin User</p>
                <p className="text-xs text-muted">Superadmin</p>
              </div>
            </div>
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
