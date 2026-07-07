import Link from 'next/link';
import { ArrowUpRight, DollarSign, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { User } from '@/models/User';

type AdminOrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

type RecentAdminOrder = {
  _id: { toString(): string };
  user?: {
    name?: string;
    email?: string;
  };
  items: Array<{
    quantity: number;
    product?: {
      title?: string;
    };
  }>;
  totalAmount: number;
  status: AdminOrderStatus;
  createdAt?: Date;
};

type RevenuePoint = {
  _id: {
    year: number;
    month: number;
  };
  total: number;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function formatDate(date?: Date) {
  if (!date) return 'No date';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function getStatusClass(status: AdminOrderStatus) {
  if (status === 'delivered') return 'bg-green-100 text-green-700';
  if (status === 'shipped') return 'bg-blue-100 text-blue-700';
  if (status === 'cancelled') return 'bg-red-100 text-red-700';
  if (status === 'paid') return 'bg-purple-100 text-purple-700';
  return 'bg-orange-100 text-orange-700';
}

function getMonthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(year, month - 1, 1));
}

function getLastSixMonthKeys() {
  const months = [];
  const today = new Date();

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - index, 1);
    months.push({
      key: `${date.getFullYear()}-${date.getMonth() + 1}`,
      label: getMonthLabel(date.getFullYear(), date.getMonth() + 1),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    });
  }

  return months;
}

async function getAdminDashboardData() {
  await dbConnect();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthWindowStart = new Date();
  monthWindowStart.setMonth(monthWindowStart.getMonth() - 5);
  monthWindowStart.setDate(1);
  monthWindowStart.setHours(0, 0, 0, 0);

  const [
    totalRevenueResult,
    monthlyRevenueResult,
    totalUsers,
    totalVendors,
    activeUsers,
    totalProducts,
    activeProducts,
    lowStockProducts,
    pendingOrders,
    totalOrders,
    recentOrders,
    revenuePoints,
  ] = await Promise.all([
    Order.aggregate<{ total: number }>([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Order.aggregate<{ total: number }>([
      { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'vendor' }),
    User.countDocuments({ accountStatus: 'active' }),
    Product.countDocuments({}),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: true, stock: { $gt: 0, $lt: 10 } }),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({}),
    Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'title')
      .select('user items totalAmount status createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Order.aggregate<RevenuePoint>([
      { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: monthWindowStart } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          total: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);

  return {
    totalRevenue: totalRevenueResult[0]?.total || 0,
    monthlyRevenue: monthlyRevenueResult[0]?.total || 0,
    totalUsers,
    totalVendors,
    activeUsers,
    totalProducts,
    activeProducts,
    lowStockProducts,
    pendingOrders,
    totalOrders,
    recentOrders: recentOrders as unknown as RecentAdminOrder[],
    revenuePoints,
  };
}

export default async function AdminDashboard() {
  const data = await getAdminDashboardData();
  const months = getLastSixMonthKeys();
  const revenueByMonth = new Map(data.revenuePoints.map((point) => [`${point._id.year}-${point._id.month}`, point.total]));
  const chartData = months.map((month) => ({
    ...month,
    total: revenueByMonth.get(month.key) || 0,
  }));
  const maxRevenue = Math.max(...chartData.map((point) => point.total), 1);
  const stats = [
    {
      title: 'Total Revenue',
      value: formatPrice(data.totalRevenue),
      change: `${formatPrice(data.monthlyRevenue)} this month`,
      icon: DollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      href: '/admin/orders',
    },
    {
      title: 'Active Users',
      value: data.activeUsers.toLocaleString(),
      change: `${data.totalUsers.toLocaleString()} customers`,
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-100',
      href: '/admin/users',
    },
    {
      title: 'Total Products',
      value: data.totalProducts.toLocaleString(),
      change: `${data.activeProducts.toLocaleString()} active`,
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      href: '/admin/products',
    },
    {
      title: 'Pending Orders',
      value: data.pendingOrders.toLocaleString(),
      change: `${data.totalOrders.toLocaleString()} total orders`,
      icon: ShoppingBag,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      href: '/admin/orders?fulfillment=unfulfilled',
    },
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Dashboard Overview</h1>
          <p className="text-muted mt-1 text-sm">Live marketplace performance from products, orders, vendors, and users.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/orders" className="bg-white border border-[var(--border-color)] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
            View Orders
          </Link>
          <Link href="/admin/products" className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors">
            View Products
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="bg-white rounded-2xl p-6 border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-md text-green-700 bg-green-50">
                <ArrowUpRight size={16} />
                Live
              </div>
            </div>
            <div>
              <p className="text-muted text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-[var(--text-main)] m-0">{stat.value}</h3>
              <p className="text-xs text-muted mt-2 m-0">{stat.change}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold m-0">Revenue Analytics</h2>
              <p className="text-sm text-muted">Last 6 months of paid marketplace revenue</p>
            </div>
            <TrendingUp size={22} className="text-[var(--primary-color)]" />
          </div>
          <div className="flex-1 min-h-[300px] flex items-end gap-3 sm:gap-5 border-b border-l border-[var(--border-color)] px-3 pt-6">
            {chartData.map((point) => {
              const height = Math.max(Math.round((point.total / maxRevenue) * 220), point.total > 0 ? 18 : 4);

              return (
                <div key={point.key} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full flex flex-col items-center justify-end h-[240px]">
                    <div
                      className="w-full max-w-16 rounded-t-lg bg-[var(--primary-color)]/85 hover:bg-[var(--primary-color)] transition-colors"
                      style={{ height }}
                      title={`${point.label}: ${formatPrice(point.total)}`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-[var(--text-main)] m-0">{point.label}</p>
                    <p className="text-[11px] text-muted m-0">{formatPrice(point.total)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold m-0">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[var(--primary-color)] text-sm font-semibold hover:underline">View All</Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <div className="flex-1 min-h-64 flex flex-col items-center justify-center text-center">
              <ShoppingBag size={30} className="text-muted mb-3" />
              <p className="font-semibold text-[var(--text-main)] mb-1">No orders yet</p>
              <p className="text-sm text-muted m-0">Orders will appear here after customers complete checkout.</p>
            </div>
          ) : (
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
                  {data.recentOrders.map((order) => {
                    const orderId = order._id.toString();
                    const customerName = order.user?.name || 'Guest Customer';
                    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                    return (
                      <tr key={orderId} className="border-b border-[var(--border-color)] last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-3">
                          <Link href={`/admin/orders/${orderId}`} className="font-bold text-[var(--text-main)] hover:text-[var(--primary-color)] mb-0.5 block">{customerName}</Link>
                          <p className="text-xs text-muted">#{orderId} - {itemCount} items - {formatDate(order.createdAt)}</p>
                        </td>
                        <td className="py-3 font-bold text-[var(--text-main)] text-right">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="py-3 text-right">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Vendors</p>
          <p className="text-3xl font-extrabold text-[var(--text-main)] m-0">{data.totalVendors.toLocaleString()}</p>
          <p className="text-xs text-muted mt-2 m-0">Registered seller accounts</p>
        </div>
        <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Low Stock</p>
          <p className="text-3xl font-extrabold text-orange-500 m-0">{data.lowStockProducts.toLocaleString()}</p>
          <p className="text-xs text-muted mt-2 m-0">Active products below 10 units</p>
        </div>
        <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Total Orders</p>
          <p className="text-3xl font-extrabold text-[var(--text-main)] m-0">{data.totalOrders.toLocaleString()}</p>
          <p className="text-xs text-muted mt-2 m-0">All customer orders in database</p>
        </div>
      </div>
    </div>
  );
}
