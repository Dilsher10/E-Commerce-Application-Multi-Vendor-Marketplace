import { cookies } from 'next/headers';
import { PackageOpen, ReceiptText } from 'lucide-react';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { Order } from '@/models/Order';

type VendorSession = {
  id: string;
  role: 'vendor';
};

type VendorOrderItem = {
  product?: {
    title?: string;
    images?: string[];
  };
  quantity: number;
  price: number;
  vendor: { toString(): string };
};

type VendorOrder = {
  _id: { toString(): string };
  user?: {
    name?: string;
    email?: string;
  };
  items: VendorOrderItem[];
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: Date;
};

function isVendorSession(session: unknown): session is VendorSession {
  if (typeof session !== 'object' || session === null) return false;
  const value = session as Record<string, unknown>;
  return value.role === 'vendor' && typeof value.id === 'string';
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

function getStatusClass(status: VendorOrder['status']) {
  if (status === 'delivered') return 'bg-green-100 text-green-700 border border-green-200';
  if (status === 'shipped') return 'bg-blue-100 text-blue-700 border border-blue-200';
  if (status === 'cancelled') return 'bg-red-100 text-red-700 border border-red-200';
  return 'bg-orange-100 text-orange-700 border border-orange-200';
}

async function getVendorOrders(vendorId: string) {
  await dbConnect();
  const orders = await Order.find({ 'items.vendor': vendorId })
    .populate('items.product', 'title images')
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  return (orders as unknown as VendorOrder[]).map((order) => ({
    ...order,
    items: order.items.filter((item) => item.vendor.toString() === vendorId),
  }));
}

export default async function VendorOrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const session = token ? verifyToken(token) : null;
  const orders = isVendorSession(session) ? await getVendorOrders(session.id) : [];

  const totalItems = orders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );
  const pendingCount = orders.filter((order) => order.status === 'pending' || order.status === 'paid').length;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Orders</h1>
          <p className="text-muted mt-1 text-sm">View orders that include products from your store.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Vendor Orders</p>
          <p className="text-3xl font-extrabold text-[var(--text-main)] m-0">{orders.length}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Items Sold</p>
          <p className="text-3xl font-extrabold text-blue-600 m-0">{totalItems}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Needs Action</p>
          <p className="text-3xl font-extrabold text-orange-500 m-0">{pendingCount}</p>
        </div>
      </div>

      <div className="bg-white border border-[var(--border-color)] rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[var(--border-color)] flex items-center gap-3 bg-gray-50/70">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[var(--accent-color)] flex items-center justify-center">
            <ReceiptText size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold m-0">Order List</h2>
            <p className="text-xs text-muted m-0">Newest orders appear first.</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-lg bg-[var(--bg-color)] text-muted flex items-center justify-center mb-4">
              <PackageOpen size={26} />
            </div>
            <h3 className="text-xl font-bold mb-2">No vendor orders yet</h3>
            <p className="text-muted max-w-md">Orders will appear here when customers buy your products.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {orders.map((order) => {
              const orderTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
              const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'No date';

              return (
                <div key={order._id.toString()} className="p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="font-bold text-[var(--text-main)] mb-1">Order #{order._id.toString()}</p>
                      <p className="text-sm text-muted m-0">{orderDate} by {order.user?.name || order.user?.email || 'Customer'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="font-extrabold text-[var(--text-main)]">{formatPrice(orderTotal)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.items.map((item, index) => (
                      <div key={`${order._id.toString()}-${index}`} className="flex items-center gap-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] p-3">
                        <div
                          className="w-12 h-12 rounded-lg bg-white border border-[var(--border-color)] bg-cover bg-center flex-shrink-0"
                          style={item.product?.images?.[0] ? { backgroundImage: `url("${item.product.images[0]}")` } : undefined}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--text-main)] truncate mb-0.5">{item.product?.title || 'Product removed'}</p>
                          <p className="text-xs text-muted m-0">Qty {item.quantity} x {formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
