'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'user' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-16 flex justify-center items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-card w-full max-w-md animate-fade-in">
        <h2 className="text-center mb-6">Create an Account</h2>
        
        {error && <div className="mb-4 p-3 rounded bg-danger" style={{ color: 'white' }}>{error}</div>}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block mb-2 text-muted">Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <label className="block mb-2 text-muted">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block mb-2 text-muted">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-muted">
          Already have an account? <Link href="/auth/login" style={{ color: 'var(--primary-color)' }}>Sign In</Link>
        </p>
        <p className="mt-2 text-center text-muted text-sm">
          Want to sell products? <Link href="/vendor/register" style={{ color: 'var(--secondary-color)' }}>Register as a Vendor</Link>
        </p>
      </div>
    </div>
  );
}
