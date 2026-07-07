import { cookies } from 'next/headers';
import Link from 'next/link';
import { CheckCircle2, DollarSign, Package, ShoppingCart, Star } from 'lucide-react';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { User } from '@/models/User';

type VendorSession = {
  id: string;
  role: 'vendor';
};

type VendorUser = {
  name: string;
  vendorDetails?: {
    storeName?: string;
    description?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    isApproved?: boolean;
  };
};

type DashboardOrderItem = {
  product?: {
    title?: string;
  };
  quantity: number;
  price: number;
  vendor: { toString(): string };
};

type DashboardOrder = {
  _id: { toString(): string };
  items: DashboardOrderItem[];
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: Date;
};

function isVendorSession(session: unknown): session is VendorSession {
  if (typeof session !== 'object' || session === null) return false;
  const value = session as Record<string, unknown>;
  return value.role === 'vendor' && typeof value.id === 'string';
}

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

function getStatusClass(status: DashboardOrder['status']) {
  if (status === 'delivered') return 'bg-green-100 text-green-700';
  if (status === 'shipped') return 'bg-blue-100 text-blue-700';
  if (status === 'cancelled') return 'bg-red-100 text-red-700';
  return 'bg-orange-100 text-orange-700';
}

function getVendorItems(order: DashboardOrder, vendorId: string) {
  return order.items.filter((item) => item.vendor.toString() === vendorId);
}

function getVendorOrderAmount(order: DashboardOrder, vendorId: string) {
  return getVendorItems(order, vendorId).reduce((sum, item) => sum + item.price * item.quantity, 0);
}

async function getDashboardData(vendorId: string) {
  await dbConnect();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [vendor, products, orders] = await Promise.all([
    User.findById(vendorId).select('name vendorDetails').lean(),
    Product.find({ vendor: vendorId }).select('title stock isActive createdAt').lean(),
    Order.find({ 'items.vendor': vendorId })
      .populate('items.product', 'title')
      .select('items status createdAt')
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  return {
    vendor: vendor as unknown as VendorUser | null,
    products: products as unknown as { stock: number; isActive: boolean }[],
    orders: orders as unknown as DashboardOrder[],
    startOfMonth,
  };
}

export default async function VendorDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const session = token ? verifyToken(token) : null;

  const vendorId = isVendorSession(session) ? session.id : '';
  const { vendor, products, orders, startOfMonth } = vendorId
    ? await getDashboardData(vendorId)
    : { vendor: null, products: [], orders: [], startOfMonth: new Date() };

  const storeName = vendor?.vendorDetails?.storeName || vendor?.name || 'Your Store';
  const activeProducts = products.filter((product) => product.isActive);
  const lowStockProducts = products.filter((product) => product.isActive && product.stock > 0 && product.stock < 10);
  const outOfStockProducts = products.filter((product) => product.isActive && product.stock === 0);
  const activeOrders = orders.filter((order) => ['pending', 'paid', 'shipped'].includes(order.status));
  const completedOrders = orders.filter((order) => order.status === 'delivered');
  const monthlyEarnings = orders
    .filter((order) => order.status !== 'cancelled' && order.createdAt && new Date(order.createdAt) >= startOfMonth)
    .reduce((sum, order) => sum + getVendorOrderAmount(order, vendorId), 0);
  const itemsSold = orders
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + getVendorItems(order, vendorId).reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  const setupTasks = [
    { label: 'Vendor account approved', complete: Boolean(vendor?.vendorDetails?.isApproved) },
    { label: 'Store profile completed', complete: Boolean(vendor?.vendorDetails?.description || vendor?.vendorDetails?.phone || vendor?.vendorDetails?.address) },
    { label: 'First product added', complete: products.length > 0 },
    { label: 'First order received', complete: orders.length > 0 },
  ];
  const setupCompleteCount = setupTasks.filter((task) => task.complete).length;
  const setupPercent = Math.round((setupCompleteCount / setupTasks.length) * 100);
  const setupOffset = 226.2 * (1 - setupPercent / 100);

  const stats = [
    { title: 'Monthly Earnings', value: formatPrice(monthlyEarnings), change: 'This month', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Active Orders', value: activeOrders.length.toString(), change: `${completedOrders.length} delivered`, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Items Sold', value: itemsSold.toString(), change: `${orders.length} orders`, icon: Star, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Total Products', value: products.length.toString(), change: `${activeProducts.length} active`, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const recentOrders = orders.slice(0, 5).map((order) => {
    const vendorItems = getVendorItems(order, vendorId);
    const firstTitle = vendorItems[0]?.product?.title || 'Vendor products';
    const extraCount = Math.max(vendorItems.length - 1, 0);

    return {
      id: order._id.toString(),
      item: extraCount > 0 ? `${firstTitle} + ${extraCount} more` : firstTitle,
      date: formatDate(order.createdAt),
      amount: formatPrice(getVendorOrderAmount(order, vendorId)),
      status: order.status,
    };
  });

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Overview</h1>
          <p className="text-muted mt-1 text-sm">Welcome to your Seller Central dashboard, {storeName}.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 mb-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0 relative w-20 h-20 flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={226.2} strokeDashoffset={setupOffset} className="text-[var(--accent-color)]" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">{setupPercent}%</div>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-1">Store setup progress</h2>
          <p className="text-sm text-muted mb-4">{setupCompleteCount} of {setupTasks.length} setup steps are complete.</p>
          <div className="flex flex-wrap gap-4">
            {setupTasks.map((task) => (
              <span key={task.label} className={`inline-flex items-center gap-1.5 text-sm font-semibold ${task.complete ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle2 size={16} />
                {task.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-2xl p-6 border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className="text-sm font-semibold px-2 py-1 rounded-md text-green-700 bg-green-50">
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
        <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold m-0">Recent Orders</h2>
            <Link href="/vendor/orders" className="text-[var(--accent-color)] text-sm font-semibold hover:underline">View All</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="flex-1 min-h-48 flex flex-col items-center justify-center text-center">
              <ShoppingCart size={28} className="text-muted mb-3" />
              <p className="font-semibold text-[var(--text-main)] mb-1">No orders yet</p>
              <p className="text-sm text-muted m-0">Orders will appear here when customers buy your products.</p>
            </div>
          ) : (
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
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <p className="font-bold text-[var(--text-main)] mb-0.5 line-clamp-1">{order.item}</p>
                        <p className="text-xs text-muted">#{order.id} - {order.date}</p>
                      </td>
                      <td className="py-3 font-bold text-[var(--text-main)] text-right">
                        {order.amount}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold mb-6 m-0">Inventory Health</h2>
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--text-main)]">Active Listings</p>
                <p className="text-xs text-muted">Products currently visible in your store</p>
              </div>
              <span className="font-extrabold text-green-600">{activeProducts.length}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: products.length ? `${Math.round((activeProducts.length / products.length) * 100)}%` : '0%' }} />
            </div>

            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="font-bold text-[var(--text-main)]">Low Stock</p>
                <p className="text-xs text-muted">Active products with fewer than 10 units</p>
              </div>
              <span className="font-extrabold text-orange-500">{lowStockProducts.length}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-orange-400 h-full" style={{ width: activeProducts.length ? `${Math.round((lowStockProducts.length / activeProducts.length) * 100)}%` : '0%' }} />
            </div>

            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="font-bold text-[var(--text-main)]">Out of Stock</p>
                <p className="text-xs text-muted">Active products with no remaining units</p>
              </div>
              <span className="font-extrabold text-red-500">{outOfStockProducts.length}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full" style={{ width: activeProducts.length ? `${Math.round((outOfStockProducts.length / activeProducts.length) * 100)}%` : '0%' }} />
            </div>
          </div>

          <Link href="/vendor/products" className="w-full mt-6 bg-[var(--bg-color)] border border-[var(--border-color)] py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors text-center">
            Manage Products
          </Link>
        </div>
      </div>
    </div>
  );
}
