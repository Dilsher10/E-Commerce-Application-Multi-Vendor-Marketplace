import { Search, Filter, Download, Eye, MoreHorizontal, CheckCircle2, Clock, XCircle, Truck } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrders() {
  const orders = [
    { 
      id: 'ORD-7352', 
      customer: { name: 'Sarah Jenkins', email: 'sarah.j@example.com' }, 
      date: 'Oct 24, 2026', 
      items: 3, 
      total: '$1,299.00', 
      paymentStatus: 'Paid', 
      fulfillmentStatus: 'Delivered', 
    },
    { 
      id: 'ORD-7351', 
      customer: { name: 'Michael Chen', email: 'm.chen92@example.com' }, 
      date: 'Oct 24, 2026', 
      items: 1, 
      total: '$149.99', 
      paymentStatus: 'Paid', 
      fulfillmentStatus: 'Processing', 
    },
    { 
      id: 'ORD-7350', 
      customer: { name: 'Amanda Torres', email: 'atorres@company.com' }, 
      date: 'Oct 23, 2026', 
      items: 2, 
      total: '$299.50', 
      paymentStatus: 'Pending', 
      fulfillmentStatus: 'Unfulfilled', 
    },
    { 
      id: 'ORD-7349', 
      customer: { name: 'David Kim', email: 'davidk@startup.io' }, 
      date: 'Oct 23, 2026', 
      items: 1, 
      total: '$89.00', 
      paymentStatus: 'Failed', 
      fulfillmentStatus: 'Cancelled', 
    },
    { 
      id: 'ORD-7348', 
      customer: { name: 'Emma Watson', email: 'emma.w@studio.net' }, 
      date: 'Oct 22, 2026', 
      items: 5, 
      total: '$1,499.00', 
      paymentStatus: 'Paid', 
      fulfillmentStatus: 'Shipped', 
    },
    { 
      id: 'ORD-7347', 
      customer: { name: 'James Wilson', email: 'james.wilson@mail.com' }, 
      date: 'Oct 21, 2026', 
      items: 2, 
      total: '$450.00', 
      paymentStatus: 'Refunded', 
      fulfillmentStatus: 'Returned', 
    },
  ];

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700 border border-green-200';
      case 'Pending': return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'Failed': return 'bg-red-100 text-red-700 border border-red-200';
      case 'Refunded': return 'bg-gray-100 text-gray-700 border border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getFulfillmentStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered': return { color: 'text-green-600', icon: CheckCircle2 };
      case 'Shipped': return { color: 'text-blue-600', icon: Truck };
      case 'Processing': return { color: 'text-orange-600', icon: Clock };
      case 'Unfulfilled': return { color: 'text-gray-500', icon: Clock };
      case 'Cancelled': return { color: 'text-red-600', icon: XCircle };
      case 'Returned': return { color: 'text-purple-600', icon: XCircle };
      default: return { color: 'text-gray-500', icon: Clock };
    }
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Orders</h1>
          <p className="text-muted mt-1 text-sm">Manage transactions, track shipments, and process refunds.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-[var(--border-color)] text-[var(--text-main)] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar (Search & Filters) */}
        <div className="p-4 sm:p-6 border-b border-[var(--border-color)] flex flex-col lg:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
            <div className="relative w-full sm:max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="text" 
                placeholder="Search by order ID, customer name, or email..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm focus:border-[var(--primary-color)] outline-none transition-colors shadow-sm"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto">
              <Filter size={16} />
              More Filters
            </button>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <select className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] hover:bg-gray-50 transition-colors shadow-sm outline-none w-full sm:w-auto cursor-pointer">
              <option>Payment: All</option>
              <option>Payment: Paid</option>
              <option>Payment: Pending</option>
              <option>Payment: Failed</option>
            </select>
            <select className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] hover:bg-gray-50 transition-colors shadow-sm outline-none w-full sm:w-auto cursor-pointer">
              <option>Status: All</option>
              <option>Status: Unfulfilled</option>
              <option>Status: Processing</option>
              <option>Status: Shipped</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 text-muted uppercase text-xs font-bold tracking-wider border-b border-[var(--border-color)]">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 text-center">Items</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
                <th className="px-6 py-4 text-center">Payment</th>
                <th className="px-6 py-4">Fulfillment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {orders.map((order, i) => {
                const StatusIcon = getFulfillmentStatusBadge(order.fulfillmentStatus).icon;
                const statusColor = getFulfillmentStatusBadge(order.fulfillmentStatus).color;
                
                return (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--text-main)] hover:text-[var(--primary-color)] transition-colors cursor-pointer text-base">{order.id}</span>
                        <span className="text-xs text-muted font-medium">{order.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">
                          {order.customer.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[var(--text-main)]">{order.customer.name}</span>
                          <span className="text-xs text-muted">{order.customer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-gray-700 font-bold text-xs">
                        {order.items}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-[var(--text-main)] text-base">
                      {order.total}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPaymentStatusBadge(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 font-bold text-sm ${statusColor}`}>
                        <StatusIcon size={16} strokeWidth={2.5} />
                        {order.fulfillmentStatus}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-blue-50 rounded-lg transition-colors" title="View Order Details">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-blue-50 rounded-lg transition-colors" title="More Actions">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 sm:p-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <p className="text-sm text-muted font-medium">Showing <span className="font-bold text-[var(--text-main)]">1</span> to <span className="font-bold text-[var(--text-main)]">6</span> of <span className="font-bold text-[var(--text-main)]">156</span> orders</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-[var(--border-color)] bg-white rounded-lg text-sm font-semibold text-gray-400 cursor-not-allowed shadow-sm">
              Previous
            </button>
            <div className="hidden sm:flex items-center gap-1">
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--primary-color)] text-white font-bold shadow-sm">1</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[var(--border-color)] text-muted hover:bg-gray-50 font-bold transition-colors shadow-sm">2</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[var(--border-color)] text-muted hover:bg-gray-50 font-bold transition-colors shadow-sm">3</button>
              <span className="text-muted px-1">...</span>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[var(--border-color)] text-muted hover:bg-gray-50 font-bold transition-colors shadow-sm">26</button>
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
