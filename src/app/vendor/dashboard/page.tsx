import { DollarSign, ShoppingCart, Star, Package, ArrowUpRight, Plus, Eye, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function VendorDashboard() {
  const stats = [
    { title: 'Monthly Earnings', value: '$4,250.00', change: '+12.5%', isUp: true, icon: DollarSign, color: 'text-teal-600', bg: 'bg-teal-100' },
    { title: 'Active Orders', value: '18', change: '+2.4%', isUp: true, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Store Rating', value: '4.8/5.0', change: '+0.1', isUp: true, icon: Star, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Total Products', value: '42', change: 'Live', isUp: true, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const recentOrders = [
    { id: '#ORD-7352', item: 'Quantum Pro Wireless Earbuds', date: 'Today, 10:42 AM', amount: '$149.99', status: 'Pending' },
    { id: '#ORD-7345', item: 'NovaLite Powerbank', date: 'Yesterday, 2:15 PM', amount: '$39.99', status: 'Shipped' },
    { id: '#ORD-7341', item: 'AeroBook Ultra 14" Laptop', date: 'Oct 23, 2026', amount: '$1,299.00', status: 'Delivered' },
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Overview</h1>
          <p className="text-muted mt-1 text-sm">Welcome to your Seller Central dashboard, Tech Haven Ltd.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/vendor/products/new" className="flex items-center gap-2 bg-[var(--accent-color)] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-600 transition-colors shadow-sm">
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Store Setup Progress (Example of Gamification) */}
      <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 mb-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0 relative w-20 h-20 flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={226.2} strokeDashoffset={226.2 * 0.2} className="text-[var(--accent-color)]" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">80%</div>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-1">Your store is almost complete!</h2>
          <p className="text-sm text-muted mb-4">Complete the final steps to boost your product visibility and sales.</p>
          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600"><CheckCircle2 size={16} /> Connect Bank Account</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600"><CheckCircle2 size={16} /> Add Store Logo</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 border-b border-dashed border-gray-400 pb-0.5 cursor-pointer hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]">Link Social Media</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-md text-green-700 bg-green-50">
                <ArrowUpRight size={16} />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-muted text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-[var(--text-main)] m-0">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold m-0">Recent Orders</h2>
            <Link href="/vendor/orders" className="text-[var(--accent-color)] text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-muted border-b border-[var(--border-color)]">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={i} className="border-b border-[var(--border-color)] last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="py-3">
                      <p className="font-bold text-[var(--text-main)] mb-0.5 line-clamp-1">{order.item}</p>
                      <p className="text-xs text-muted">{order.id} • {order.date}</p>
                    </td>
                    <td className="py-3 font-bold text-[var(--text-main)] text-right">
                      {order.amount}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                          'bg-orange-100 text-orange-700'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Store Health */}
        <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold mb-6 m-0">Store Health</h2>
          
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--text-main)]">Response Rate</p>
                <p className="text-xs text-muted">Average time to reply to customer messages</p>
              </div>
              <span className="font-extrabold text-green-600">98%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full w-[98%]"></div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="font-bold text-[var(--text-main)]">On-Time Delivery</p>
                <p className="text-xs text-muted">Orders delivered within estimated timeframe</p>
              </div>
              <span className="font-extrabold text-orange-500">85%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-orange-400 h-full w-[85%]"></div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="font-bold text-[var(--text-main)]">Return Rate</p>
                <p className="text-xs text-muted">Percentage of items returned this month</p>
              </div>
              <span className="font-extrabold text-green-600">1.2%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full w-[98.8%]"></div>
            </div>
          </div>
          
          <button className="w-full mt-6 bg-[var(--bg-color)] border border-[var(--border-color)] py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
            View Detailed Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
