'use client';

import Link from 'next/link';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminHeaderProfileMenu() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.replace('/auth/login');
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <details className="relative group">
      <summary className="flex list-none items-center gap-2 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-[var(--bg-color)] transition-colors">
        <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm">
          A
        </div>
        <ChevronDown size={16} className="text-muted group-open:rotate-180 transition-transform" />
      </summary>

      <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-[var(--border-color)] bg-white shadow-lg overflow-hidden z-20">
        <Link href="/admin/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[var(--text-main)] hover:bg-[var(--bg-color)]">
          <User size={17} />
          Profile
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-[var(--danger)] hover:bg-red-50 disabled:opacity-60"
        >
          <LogOut size={17} />
          {isPending ? 'Signing Out...' : 'Logout'}
        </button>
      </div>
    </details>
  );
}
