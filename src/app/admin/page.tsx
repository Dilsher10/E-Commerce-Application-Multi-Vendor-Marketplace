import { DollarSign, Users, ShoppingBag, ArrowUpRight, ArrowDownRight, Package, MoreHorizontal, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Revenue', value: '$124,563.00', change: '+14.5%', isUp: true, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Active Users', value: '8,234', change: '+5.2%', isUp: true, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Products', value: '1,423', change: '-1.4%', isUp: false, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Pending Orders', value: '156', change: '+12.5%', isUp: true, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const recentOrders = [
    { id: '#ORD-7352', customer: 'Sarah Jenkins', date: 'Oct 24, 2026', amount: '$1,299.00', status: 'Delivered', statusColor: 'bg-green-100 text-green-700' },
    { id: '#ORD-7351', customer: 'Michael Chen', date: 'Oct 24, 2026', amount: '$149.99', status: 'Processing', statusColor: 'bg-blue-100 text-blue-700' },
    { id: '#ORD-7350', customer: 'Amanda Torres', date: 'Oct 23, 2026', amount: '$299.50', status: 'Shipped', statusColor: 'bg-purple-100 text-purple-700' },
    { id: '#ORD-7349', customer: 'David Kim', date: 'Oct 23, 2026', amount: '$89.00', status: 'Pending', statusColor: 'bg-orange-100 text-orange-700' },
    { id: '#ORD-7348', customer: 'Emma Watson', date: 'Oct 22, 2026', amount: '$1,499.00', status: 'Delivered', statusColor: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Dashboard Overview</h1>
          <p className="text-muted mt-1 text-sm">Welcome back, here's what's happening with your store today.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[var(--border-color)] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
            Export Data
          </button>
          <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors">
            Generate Report
          </button>
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
              <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-md ${stat.isUp ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                {stat.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold m-0">Revenue Analytics</h2>
              <p className="text-sm text-muted">Monthly sales performance</p>
            </div>
            <select className="text-sm border border-[var(--border-color)] rounded-lg px-3 py-1.5 bg-gray-50 outline-none w-auto">
              <option>This Year</option>
              <option>Last 6 Months</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[300px] text-muted">
             <TrendingUp size={48} className="text-gray-300 mb-4" />
             <p className="font-medium text-gray-500">Sales Chart Visualization Area</p>
             <p className="text-sm text-gray-400">Integrate Recharts or Chart.js here</p>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold m-0">Recent Orders</h2>
            <button className="text-[var(--primary-color)] text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-muted border-b border-[var(--border-color)]">
                  <th className="pb-3 font-semibold w-1/2">Customer</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={i} className="border-b border-[var(--border-color)] last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <p className="font-bold text-[var(--text-main)] mb-0.5">{order.customer}</p>
                      <p className="text-xs text-muted">{order.id} • {order.date}</p>
                    </td>
                    <td className="py-3 font-bold text-[var(--text-main)] text-right">
                      {order.amount}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
