'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function VendorRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
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
        body: JSON.stringify({ name, email, password, role: 'vendor', storeName, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/vendor/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-16 flex justify-center items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-card w-full max-w-lg animate-fade-in">
        <h2 className="text-center mb-2" style={{ background: 'linear-gradient(to right, var(--secondary-color), var(--primary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Become a Vendor
        </h2>
        <p className="text-center text-muted mb-6">Start selling your premium products on Lumina</p>
        
        {error && <div className="mb-4 p-3 rounded bg-danger" style={{ color: 'white' }}>{error}</div>}

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block mb-2 text-muted">Store Name</label>
            <input type="text" required value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="My Awesome Store" />
          </div>
          <div>
            <label className="block mb-2 text-muted">Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <label className="block mb-2 text-muted">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2 text-muted">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2 text-muted">Store Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about what you sell..." rows={3} />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
              {loading ? 'Creating Store...' : 'Launch Your Store'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-muted">
          Already selling? <Link href="/auth/login" style={{ color: 'var(--primary-color)' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
