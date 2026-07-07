import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Bell, Store } from 'lucide-react';
import { verifyToken } from '@/lib/auth';
import VendorLogoutButton from '@/components/VendorLogoutButton';
import VendorSidebarNav from '@/components/VendorSidebarNav';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';

type VendorSession = {
  id: string;
  role: 'vendor';
};

type VendorUser = {
  name: string;
  vendorDetails?: {
    storeName?: string;
  };
};

function isVendorSession(session: unknown): session is VendorSession {
  if (typeof session !== 'object' || session === null) return false;
  const value = session as Record<string, unknown>;
  return value.role === 'vendor' && typeof value.id === 'string';
}

async function getVendorUser(vendorId: string) {
  await dbConnect();
  const user = await User.findById(vendorId).select('name vendorDetails.storeName').lean();
  return user as unknown as VendorUser | null;
}

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const session = token ? verifyToken(token) : null;

  if (!isVendorSession(session)) {
    redirect('/auth/login');
  }

  const vendor = await getVendorUser(session.id);
  const storeName = vendor?.vendorDetails?.storeName || vendor?.name || 'Vendor Store';

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
        
        <VendorSidebarNav />
        
        <div className="p-4 border-t border-[var(--border-color)]">
          <VendorLogoutButton />
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
            <h2 className="font-bold text-lg hidden sm:block truncate max-w-[280px]">{storeName}</h2>
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
