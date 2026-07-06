'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, UserPlus, ShieldAlert, CheckCircle2, Mail, Edit, Trash2, Ban, X } from 'lucide-react';

type DatabaseUser = {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'vendor' | 'admin';
  accountStatus?: 'active' | 'banned';
  image?: string;
  createdAt: string;
  vendorDetails?: {
    storeName?: string;
    isApproved?: boolean;
  };
};

type DisplayUser = {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Vendor' | 'Admin';
  joined: string;
  spent: string;
  orders: number;
  status: 'Active' | 'Pending' | 'Banned';
  avatar: string;
};

type ModalState =
  | { type: 'form'; mode: 'add' | 'edit'; user?: DisplayUser }
  | { type: 'confirm'; action: 'approve' | 'toggleBan' | 'delete'; user: DisplayUser }
  | null;

function toDisplayUser(user: DatabaseUser): DisplayUser {
  const role = user.role === 'admin' ? 'Admin' : user.role === 'vendor' ? 'Vendor' : 'Customer';
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role,
    joined: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    spent: '$0.00',
    orders: 0,
    status: user.accountStatus === 'banned' ? 'Banned' : user.role === 'vendor' && !user.vendorDetails?.isApproved ? 'Pending' : 'Active',
    avatar: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
  };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modal, setModal] = useState<ModalState>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('user');
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/admin/users')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load users');
        return data.users as DatabaseUser[];
      })
      .then((databaseUsers) => {
        if (cancelled) return;
        setUsers(databaseUsers.map(toDisplayUser));
      })
      .catch((error: unknown) => console.error('Failed to load users:', error));

    return () => { cancelled = true; };
  }, []);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query) || user.id.toLowerCase().includes(query);
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  }), [users, search, roleFilter, statusFilter]);

  async function request(url: string, options: RequestInit) {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Action failed');
    return data;
  }

  function openAddModal() {
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('user');
    setModalError('');
    setModal({ type: 'form', mode: 'add' });
  }

  function openEditModal(user: DisplayUser) {
    if (user.role === 'Vendor' && user.status === 'Pending') {
      setModalError('');
      setModal({ type: 'confirm', action: 'approve', user });
      return;
    }
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword('');
    setFormRole(user.role === 'Customer' ? 'user' : user.role.toLowerCase());
    setModalError('');
    setModal({ type: 'form', mode: 'edit', user });
  }

  async function submitUserForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!modal || modal.type !== 'form') return;
    setSaving(true);
    setModalError('');
    try {
      const isAdd = modal.mode === 'add';
      const data = await request('/api/admin/users', {
        method: isAdd ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isAdd
          ? { name: formName, email: formEmail, password: formPassword, role: formRole }
          : { userId: modal.user?.id, action: 'edit', name: formName, email: formEmail, role: formRole }),
      });
      const savedUser = toDisplayUser(data.user);
      setUsers((current) => isAdd ? [...current, savedUser] : current.map((item) => item.id === savedUser.id ? savedUser : item));
      setModal(null);
    } catch (error) {
      setModalError(error instanceof Error ? error.message : 'Unable to save user');
    } finally {
      setSaving(false);
    }
  }

  async function confirmAction() {
    if (!modal || modal.type !== 'confirm') return;
    const { action, user } = modal;
    setSaving(true);
    setModalError('');
    try {
      if (action === 'delete') {
        await request(`/api/admin/users?userId=${encodeURIComponent(user.id)}`, { method: 'DELETE' });
        setUsers((current) => current.filter((item) => item.id !== user.id));
      } else {
        const data = await request('/api/admin/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action === 'approve'
            ? { userId: user.id, approved: true }
            : { userId: user.id, action: 'toggleBan' }),
        });
        setUsers((current) => current.map((item) => item.id === user.id ? toDisplayUser(data.user) : item));
      }
      setModal(null);
    } catch (error) {
      setModalError(error instanceof Error ? error.message : 'Unable to complete action');
    } finally {
      setSaving(false);
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'Vendor': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'Customer': return 'bg-gray-100 text-gray-700 border border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50 border border-green-200';
      case 'Pending': return 'text-orange-600 bg-orange-50 border border-orange-200';
      case 'Banned': return 'text-red-600 bg-red-50 border border-red-200';
      default: return 'text-gray-600 bg-gray-50 border border-gray-200';
    }
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Users</h1>
          <p className="text-muted mt-1 text-sm">Manage customers, vendors, and administrative accounts.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-[var(--primary-color)] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors shadow-sm">
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users by name, email, or ID..." className="w-full pl-10 pr-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm focus:border-[var(--primary-color)] outline-none transition-colors shadow-sm" />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] hover:bg-gray-50 transition-colors shadow-sm outline-none w-full sm:w-auto cursor-pointer">
              <option value="All">Role: All</option><option value="Customer">Role: Customer</option><option value="Vendor">Role: Vendor</option><option value="Admin">Role: Admin</option>
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] hover:bg-gray-50 transition-colors shadow-sm outline-none w-full sm:w-auto cursor-pointer">
              <option value="All">Status: All</option><option value="Active">Status: Active</option><option value="Pending">Status: Pending</option><option value="Banned">Status: Banned</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 text-muted uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Joined Date</th><th className="px-6 py-4 text-center">Orders</th><th className="px-6 py-4 text-right">Total Spent</th><th className="px-6 py-4 text-center">Status</th><th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`hover:bg-gray-50/50 transition-colors group ${user.status === 'Banned' ? 'opacity-75 bg-red-50/10' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-[var(--border-color)] object-cover shadow-sm" />
                      <div>
                        <p className="font-bold text-[var(--text-main)] text-base group-hover:text-[var(--primary-color)] transition-colors cursor-pointer">{user.name}</p>
                        <div className="flex items-center gap-1 mt-0.5 text-muted"><Mail size={12} /><span className="text-xs">{user.email}</span></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-1 rounded-md font-semibold text-xs ${getRoleBadge(user.role)}`}>{user.role}</span></td>
                  <td className="px-6 py-4 text-muted font-medium">{user.joined}</td>
                  <td className="px-6 py-4 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gray-100 text-gray-700 font-bold text-xs">{user.orders}</span></td>
                  <td className="px-6 py-4 text-right font-extrabold text-[var(--text-main)] text-base">{user.spent}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusBadge(user.status)}`}>
                      {user.status === 'Active' && <CheckCircle2 size={14} />}{user.status === 'Pending' && <ShieldAlert size={14} />}{user.status === 'Banned' && <Ban size={14} />}{user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(user)} className="p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-blue-50 rounded-lg transition-colors" title={user.role === 'Vendor' && user.status === 'Pending' ? 'Approve Vendor' : 'Edit User'}><Edit size={18} /></button>
                      <button onClick={() => { setModalError(''); setModal({ type: 'confirm', action: 'toggleBan', user }); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title={user.status === 'Banned' ? 'Unban User' : 'Ban User'}><Ban size={18} /></button>
                      <button onClick={() => { setModalError(''); setModal({ type: 'confirm', action: 'delete', user }); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Account"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 sm:p-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <p className="text-sm text-muted font-medium">Showing <span className="font-bold text-[var(--text-main)]">{filteredUsers.length ? 1 : 0}</span> to <span className="font-bold text-[var(--text-main)]">{filteredUsers.length}</span> of <span className="font-bold text-[var(--text-main)]">{users.length}</span> users</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-[var(--border-color)] bg-white rounded-lg text-sm font-semibold text-gray-400 cursor-not-allowed shadow-sm">Previous</button>
            <div className="hidden sm:flex items-center gap-1">
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--primary-color)] text-white font-bold shadow-sm">1</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[var(--border-color)] text-muted hover:bg-gray-50 font-bold transition-colors shadow-sm">2</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[var(--border-color)] text-muted hover:bg-gray-50 font-bold transition-colors shadow-sm">3</button>
              <span className="text-muted px-1">...</span>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[var(--border-color)] text-muted hover:bg-gray-50 font-bold transition-colors shadow-sm">1,372</button>
            </div>
            <button className="px-4 py-2 border border-[var(--border-color)] bg-white rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm text-[var(--text-main)]">Next</button>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setModal(null); }}>
          <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="mb-1 text-xl font-bold">
                  {modal.type === 'form' ? (modal.mode === 'add' ? 'Add New User' : 'Edit User') : modal.action === 'approve' ? 'Approve Vendor' : modal.action === 'delete' ? 'Delete Account' : modal.user.status === 'Banned' ? 'Unban User' : 'Ban User'}
                </h2>
                <p className="mb-0 text-sm text-muted">
                  {modal.type === 'confirm' && (modal.action === 'approve' ? `Allow ${modal.user.name} to access the vendor dashboard?` : modal.action === 'delete' ? `Permanently delete ${modal.user.name}? This cannot be undone.` : `${modal.user.status === 'Banned' ? 'Restore' : 'Suspend'} access for ${modal.user.name}?`)}
                </p>
              </div>
              <button type="button" onClick={() => setModal(null)} disabled={saving} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"><X size={20} /></button>
            </div>

            {modalError && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{modalError}</div>}

            {modal.type === 'form' ? (
              <form onSubmit={submitUserForm} className="flex flex-col gap-4">
                <div><label className="mb-2 block text-sm font-semibold">Full Name</label><input value={formName} onChange={(event) => setFormName(event.target.value)} required /></div>
                <div><label className="mb-2 block text-sm font-semibold">Email Address</label><input type="email" value={formEmail} onChange={(event) => setFormEmail(event.target.value)} required /></div>
                {modal.mode === 'add' && <div><label className="mb-2 block text-sm font-semibold">Temporary Password</label><input type="password" minLength={8} value={formPassword} onChange={(event) => setFormPassword(event.target.value)} required /></div>}
                <div><label className="mb-2 block text-sm font-semibold">Role</label><select value={formRole} onChange={(event) => setFormRole(event.target.value)}><option value="user">Customer</option><option value="vendor">Vendor</option><option value="admin">Admin</option></select></div>
                <div className="mt-2 flex justify-end gap-3"><button type="button" onClick={() => setModal(null)} disabled={saving} className="btn btn-secondary">Cancel</button><button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : modal.mode === 'add' ? 'Add User' : 'Save Changes'}</button></div>
              </form>
            ) : (
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setModal(null)} disabled={saving} className="btn btn-secondary">Cancel</button>
                <button type="button" onClick={() => void confirmAction()} disabled={saving} className={`${modal.action === 'approve' ? 'approve-vendor-button ' : ''}${modal.action === 'approve' || modal.user.status === 'Banned' ? 'btn bg-green-600 text-white hover:bg-green-700' : 'btn btn-danger'}`}>{saving ? 'Please wait...' : modal.action === 'approve' ? 'Approve Vendor' : modal.action === 'delete' ? 'Delete Account' : modal.user.status === 'Banned' ? 'Unban User' : 'Ban User'}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
