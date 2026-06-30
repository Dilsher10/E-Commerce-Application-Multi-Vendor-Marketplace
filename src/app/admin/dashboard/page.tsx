'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          router.push('/auth/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'admin') {
          router.push('/');
          return;
        }

        const res = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [router]);

  return (
    <div className="container py-16">
      <div className="flex justify-between items-center mb-8">
        <h1>Admin Dashboard</h1>
        <button onClick={() => { localStorage.clear(); router.push('/auth/login'); }} className="btn btn-secondary">
          Logout
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-16"><div className="loader"></div></div>
      ) : (
        <div className="glass-card">
          <h3 className="mb-4">System Users & Vendors</h3>
          <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
            <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--bg-surface-hover)' }}>
                <tr>
                  <th className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>Name</th>
                  <th className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>Email</th>
                  <th className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>Role</th>
                  <th className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>Store Name</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="p-4">{user.name}</td>
                    <td className="p-4 text-muted">{user.email}</td>
                    <td className="p-4">
                      <span className={`badge ${user.role === 'admin' ? 'badge-primary' : user.role === 'vendor' ? 'badge-success' : 'bg-surface-hover text-muted'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-muted">{user.vendorDetails?.storeName || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
