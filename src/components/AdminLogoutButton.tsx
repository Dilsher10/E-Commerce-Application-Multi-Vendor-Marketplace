'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLogoutButton() {
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
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--danger)] hover:bg-white/5 disabled:opacity-60 w-full transition-colors font-medium"
    >
      <LogOut size={20} />
      {isPending ? 'Signing Out...' : 'Sign Out'}
    </button>
  );
}
