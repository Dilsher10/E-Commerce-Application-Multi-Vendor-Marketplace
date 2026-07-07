import { CheckCircle2, Clock, Eye, PackageOpen, Truck, XCircle } from 'lucide-react';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';
import AdminOrderFilters from '@/components/AdminOrderFilters';

type AdminOrder = {
  _id: { toString(): string };
  user?: {
    name?: string;
    email?: string;
  };
  items: Array<{
    quantity: number;
    price: number;
    product?: {
      title?: string;
    };
  }>;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: Date;
};

type OrderFilters = {
  q: string;
  payment: string;
  fulfillment: string;
  from: string;
  to: string;
};

type OrderQuery = {
  status?: AdminOrder['status'] | { $in: AdminOrder['status'][] };
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
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

function getPaymentStatus(orderStatus: AdminOrder['status']) {
  if (orderStatus === 'pending') return 'Pending';
  if (orderStatus === 'cancelled') return 'Cancelled';
  return 'Paid';
}

function getPaymentStatusBadge(status: string) {
  if (status === 'Paid') return 'bg-green-100 text-green-700 border border-green-200';
  if (status === 'Pending') return 'bg-orange-100 text-orange-700 border border-orange-200';
  if (status === 'Cancelled') return 'bg-red-100 text-red-700 border border-red-200';
  return 'bg-gray-100 text-gray-700 border border-gray-200';
}

function getFulfillmentStatus(orderStatus: AdminOrder['status']) {
  if (orderStatus === 'delivered') return { label: 'Delivered', color: 'text-green-600', icon: CheckCircle2 };
  if (orderStatus === 'shipped') return { label: 'Shipped', color: 'text-blue-600', icon: Truck };
  if (orderStatus === 'cancelled') return { label: 'Cancelled', color: 'text-red-600', icon: XCircle };
  if (orderStatus === 'paid') return { label: 'Processing', color: 'text-orange-600', icon: Clock };
  return { label: 'Unfulfilled', color: 'text-gray-500', icon: Clock };
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function buildOrderQuery(filters: OrderFilters) {
  const query: OrderQuery = {};

  if (filters.payment === 'paid') query.status = { $in: ['paid', 'shipped', 'delivered'] };
  if (filters.payment === 'pending') query.status = 'pending';
  if (filters.payment === 'cancelled') query.status = 'cancelled';

  if (filters.fulfillment === 'unfulfilled') query.status = 'pending';
  if (filters.fulfillment === 'processing') query.status = 'paid';
  if (filters.fulfillment === 'shipped') query.status = 'shipped';
  if (filters.fulfillment === 'delivered') query.status = 'delivered';
  if (filters.fulfillment === 'cancelled') query.status = 'cancelled';

  if (filters.from || filters.to) {
    query.createdAt = {};
    if (filters.from) {
      const fromDate = new Date(filters.from);
      fromDate.setHours(0, 0, 0, 0);
      query.createdAt.$gte = fromDate;
    }
    if (filters.to) {
      const toDate = new Date(filters.to);
      toDate.setHours(23, 59, 59, 999);
      query.createdAt.$lte = toDate;
    }
  }

  return query;
}

function filterOrdersBySearch(orders: AdminOrder[], search: string) {
  const query = search.trim().toLowerCase();
  if (!query) return orders;

  return orders.filter((order) => {
    const orderId = order._id.toString().toLowerCase();
    const customerName = order.user?.name?.toLowerCase() || '';
    const customerEmail = order.user?.email?.toLowerCase() || '';
    const productText = order.items.map((item) => item.product?.title || '').join(' ').toLowerCase();

    return orderId.includes(query) || customerName.includes(query) || customerEmail.includes(query) || productText.includes(query);
  });
}

async function getOrders(filters: OrderFilters) {
  await dbConnect();
  const orders = await Order.find(buildOrderQuery(filters))
    .populate('user', 'name email')
    .populate('items.product', 'title')
    .sort({ createdAt: -1 })
    .lean();

  return filterOrdersBySearch(orders as unknown as AdminOrder[], filters.q);
}

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const filters = {
    q: getParam(params.q).trim(),
    payment: getParam(params.payment),
    fulfillment: getParam(params.fulfillment),
    from: getParam(params.from),
    to: getParam(params.to),
  };
  const orders = await getOrders(filters);
  const hasFilters = Boolean(filters.q || filters.payment || filters.fulfillment || filters.from || filters.to);
  const paidCount = orders.filter((order) => getPaymentStatus(order.status) === 'Paid').length;
  const pendingCount = orders.filter((order) => order.status === 'pending').length;
  const shippedCount = orders.filter((order) => order.status === 'shipped').length;
  const deliveredCount = orders.filter((order) => order.status === 'delivered').length;
  const grossRevenue = orders
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Orders</h1>
          <p className="text-muted mt-1 text-sm">Manage real marketplace transactions and fulfillment status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Total Orders</p>
          <p className="text-3xl font-extrabold text-[var(--text-main)] m-0">{orders.length}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Paid Orders</p>
          <p className="text-3xl font-extrabold text-green-600 m-0">{paidCount}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Pending</p>
          <p className="text-3xl font-extrabold text-orange-500 m-0">{pendingCount}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Revenue</p>
          <p className="text-3xl font-extrabold text-[var(--text-main)] m-0">{formatPrice(grossRevenue)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 border-b border-[var(--border-color)] bg-gray-50/50">
          <AdminOrderFilters initialFilters={filters} />
          <div className="flex items-center gap-3 mt-4 text-sm text-muted">
            <span className="font-semibold">{shippedCount} shipped</span>
            <span className="hidden sm:inline">/</span>
            <span className="font-semibold">{deliveredCount} delivered</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-lg bg-[var(--bg-color)] text-muted flex items-center justify-center mb-4">
              <PackageOpen size={26} />
            </div>
            <h3 className="text-xl font-bold mb-2">No orders found</h3>
            <p className="text-muted max-w-md">{hasFilters ? 'No orders match the selected filters.' : 'Orders will appear here after customers complete checkout.'}</p>
            {hasFilters && <Link href="/admin/orders" className="btn btn-secondary mt-5">Clear Filters</Link>}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50/80 text-muted uppercase text-xs font-bold tracking-wider border-b border-[var(--border-color)]">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Products</th>
                    <th className="px-6 py-4 text-center">Items</th>
                    <th className="px-6 py-4 text-right">Total Amount</th>
                    <th className="px-6 py-4 text-center">Payment</th>
                    <th className="px-6 py-4">Fulfillment</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {orders.map((order) => {
                    const orderId = order._id.toString();
                    const paymentStatus = getPaymentStatus(order.status);
                    const fulfillment = getFulfillmentStatus(order.status);
                    const StatusIcon = fulfillment.icon;
                    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                    const firstProduct = order.items[0]?.product?.title || 'Product unavailable';
                    const extraProducts = Math.max(order.items.length - 1, 0);
                    const customerName = order.user?.name || 'Guest Customer';
                    const customerEmail = order.user?.email || 'No email';

                    return (
                      <tr key={orderId} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-[var(--text-main)] text-base">#{orderId}</span>
                            <span className="text-xs text-muted font-medium">{formatDate(order.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">
                              {customerName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-[var(--text-main)]">{customerName}</span>
                              <span className="text-xs text-muted">{customerEmail}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[var(--text-main)] mb-0.5">{firstProduct}</p>
                          {extraProducts > 0 && <p className="text-xs text-muted m-0">+ {extraProducts} more products</p>}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-gray-700 font-bold text-xs">
                            {itemCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-[var(--text-main)] text-base">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPaymentStatusBadge(paymentStatus)}`}>
                            {paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-2 font-bold text-sm ${fulfillment.color}`}>
                            <StatusIcon size={16} strokeWidth={2.5} />
                            {fulfillment.label}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/admin/orders/${orderId}`} className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-blue-50 rounded-lg transition-colors" title="View order details">
                            <Eye size={18} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 sm:p-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
              <p className="text-sm text-muted font-medium">
                Showing <span className="font-bold text-[var(--text-main)]">{orders.length}</span> orders{hasFilters ? ' matching filters' : ''}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
