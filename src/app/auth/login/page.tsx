'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      // Store token (in real app, consider secure HttpOnly cookies)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      window.location.href = data.user.role === 'vendor' ? '/vendor/dashboard' : '/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-16 flex justify-center items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-card w-full max-w-md animate-fade-in">
        <h2 className="text-center mb-6">Welcome Back</h2>
        
        {error && <div className="mb-4 p-3 rounded bg-danger" style={{ color: 'white' }}>{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block mb-2 text-muted">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block mb-2 text-muted">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-muted">
          Don't have an account? <Link href="/auth/register" style={{ color: 'var(--primary-color)' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
