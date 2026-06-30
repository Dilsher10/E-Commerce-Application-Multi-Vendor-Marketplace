import { Search, Filter, UserPlus, MoreHorizontal, ShieldAlert, CheckCircle2, Mail, Edit, Trash2, Ban } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsers() {
  const users = [
    { 
      id: 'USR-8901', 
      name: 'Sarah Jenkins', 
      email: 'sarah.j@example.com', 
      role: 'Customer', 
      joined: 'Mar 12, 2024', 
      spent: '$2,450.00',
      orders: 12,
      status: 'Active', 
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random' 
    },
    { 
      id: 'USR-8902', 
      name: 'Tech Haven Ltd.', 
      email: 'admin@techhaven.io', 
      role: 'Vendor', 
      joined: 'Feb 05, 2024', 
      spent: '$0.00',
      orders: 0,
      status: 'Active', 
      avatar: 'https://ui-avatars.com/api/?name=Tech+Haven&background=0F172A&color=fff' 
    },
    { 
      id: 'USR-8903', 
      name: 'Admin User', 
      email: 'superadmin@lumina.com', 
      role: 'Admin', 
      joined: 'Jan 01, 2024', 
      spent: '$0.00',
      orders: 0,
      status: 'Active', 
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=2563EB&color=fff' 
    },
    { 
      id: 'USR-8904', 
      name: 'Michael Chen', 
      email: 'm.chen92@example.com', 
      role: 'Customer', 
      joined: 'Oct 15, 2026', 
      spent: '$149.99',
      orders: 1,
      status: 'Active', 
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random' 
    },
    { 
      id: 'USR-8905', 
      name: 'Audio Dynamics', 
      email: 'sales@audiodynamics.net', 
      role: 'Vendor', 
      joined: 'Oct 20, 2026', 
      spent: '$0.00',
      orders: 0,
      status: 'Pending', 
      avatar: 'https://ui-avatars.com/api/?name=Audio+Dynamics&background=random' 
    },
    { 
      id: 'USR-8906', 
      name: 'Bad Actor', 
      email: 'scammer123@tempmail.com', 
      role: 'Customer', 
      joined: 'Oct 24, 2026', 
      spent: '$0.00',
      orders: 3,
      status: 'Banned', 
      avatar: 'https://ui-avatars.com/api/?name=Bad+Actor&background=EF4444&color=fff' 
    },
  ];

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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Users</h1>
          <p className="text-muted mt-1 text-sm">Manage customers, vendors, and administrative accounts.</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--primary-color)] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors shadow-sm">
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar (Search & Filters) */}
        <div className="p-4 sm:p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Search users by name, email, or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm focus:border-[var(--primary-color)] outline-none transition-colors shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] hover:bg-gray-50 transition-colors shadow-sm outline-none w-full sm:w-auto cursor-pointer">
              <option>Role: All</option>
              <option>Role: Customer</option>
              <option>Role: Vendor</option>
              <option>Role: Admin</option>
            </select>
            <select className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] hover:bg-gray-50 transition-colors shadow-sm outline-none w-full sm:w-auto cursor-pointer">
              <option>Status: All</option>
              <option>Status: Active</option>
              <option>Status: Pending</option>
              <option>Status: Banned</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 text-muted uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-center">Orders</th>
                <th className="px-6 py-4 text-right">Total Spent</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {users.map((user) => (
                <tr key={user.id} className={`hover:bg-gray-50/50 transition-colors group ${user.status === 'Banned' ? 'opacity-75 bg-red-50/10' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-[var(--border-color)] object-cover shadow-sm" />
                      <div>
                        <p className="font-bold text-[var(--text-main)] text-base group-hover:text-[var(--primary-color)] transition-colors cursor-pointer">{user.name}</p>
                        <div className="flex items-center gap-1 mt-0.5 text-muted">
                          <Mail size={12} />
                          <span className="text-xs">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md font-semibold text-xs ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted font-medium">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gray-100 text-gray-700 font-bold text-xs">
                      {user.orders}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-extrabold text-[var(--text-main)] text-base">
                    {user.spent}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusBadge(user.status)}`}>
                      {user.status === 'Active' && <CheckCircle2 size={14} />}
                      {user.status === 'Pending' && <ShieldAlert size={14} />}
                      {user.status === 'Banned' && <Ban size={14} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-blue-50 rounded-lg transition-colors" title="Edit User">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Ban User">
                        <Ban size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Account">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 sm:p-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <p className="text-sm text-muted font-medium">Showing <span className="font-bold text-[var(--text-main)]">1</span> to <span className="font-bold text-[var(--text-main)]">6</span> of <span className="font-bold text-[var(--text-main)]">8,234</span> users</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-[var(--border-color)] bg-white rounded-lg text-sm font-semibold text-gray-400 cursor-not-allowed shadow-sm">
              Previous
            </button>
            <div className="hidden sm:flex items-center gap-1">
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--primary-color)] text-white font-bold shadow-sm">1</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[var(--border-color)] text-muted hover:bg-gray-50 font-bold transition-colors shadow-sm">2</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[var(--border-color)] text-muted hover:bg-gray-50 font-bold transition-colors shadow-sm">3</button>
              <span className="text-muted px-1">...</span>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[var(--border-color)] text-muted hover:bg-gray-50 font-bold transition-colors shadow-sm">1,372</button>
            </div>
            <button className="px-4 py-2 border border-[var(--border-color)] bg-white rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm text-[var(--text-main)]">
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
