import { cookies } from 'next/headers';
import { BadgeDollarSign, CreditCard, PackageCheck, Wallet } from 'lucide-react';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { Order } from '@/models/Order';

type VendorSession = {
  id: string;
  role: 'vendor';
};

type EarningOrderItem = {
  quantity: number;
  price: number;
  vendor: { toString(): string };
};

type EarningOrder = {
  _id: { toString(): string };
  items: EarningOrderItem[];
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

async function getEarningOrders(vendorId: string) {
  await dbConnect();
  const orders = await Order.find({ 'items.vendor': vendorId })
    .select('items status createdAt')
    .sort({ createdAt: -1 })
    .lean();

  return (orders as unknown as EarningOrder[]).map((order) => ({
    ...order,
    items: order.items.filter((item) => item.vendor.toString() === vendorId),
  }));
}

export default async function VendorEarningsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const session = token ? verifyToken(token) : null;
  const orders = isVendorSession(session) ? await getEarningOrders(session.id) : [];
  const paidOrders = orders.filter((order) => order.status !== 'cancelled');

  const grossSales = paidOrders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0),
    0
  );
  const platformFee = grossSales * 0.08;
  const netEarnings = grossSales - platformFee;
  const itemsSold = paidOrders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Earnings</h1>
          <p className="text-muted mt-1 text-sm">Track store revenue from orders containing your products.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-4">
            <Wallet size={20} />
          </div>
          <p className="text-sm font-semibold text-muted mb-1">Net Earnings</p>
          <p className="text-3xl font-extrabold text-[var(--text-main)] m-0">{formatPrice(netEarnings)}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <BadgeDollarSign size={20} />
          </div>
          <p className="text-sm font-semibold text-muted mb-1">Gross Sales</p>
          <p className="text-3xl font-extrabold text-[var(--text-main)] m-0">{formatPrice(grossSales)}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
            <CreditCard size={20} />
          </div>
          <p className="text-sm font-semibold text-muted mb-1">Platform Fee</p>
          <p className="text-3xl font-extrabold text-[var(--text-main)] m-0">{formatPrice(platformFee)}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[var(--accent-color)] flex items-center justify-center mb-4">
            <PackageCheck size={20} />
          </div>
          <p className="text-sm font-semibold text-muted mb-1">Items Sold</p>
          <p className="text-3xl font-extrabold text-[var(--text-main)] m-0">{itemsSold}</p>
        </div>
      </div>

      <div className="bg-white border border-[var(--border-color)] rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[var(--border-color)] bg-gray-50/70">
          <h2 className="text-lg font-bold m-0">Recent Earnings</h2>
          <p className="text-xs text-muted m-0">Cancelled orders are excluded from earnings.</p>
        </div>

        {paidOrders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted m-0">No earnings yet. Revenue will appear after customers purchase your products.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50 text-muted uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Vendor Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {paidOrders.slice(0, 10).map((order) => {
                  const revenue = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'No date';

                  return (
                    <tr key={order._id.toString()} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4 font-bold text-[var(--text-main)]">#{order._id.toString()}</td>
                      <td className="px-6 py-4 text-muted">{date}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 border border-green-200">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-[var(--text-main)]">{formatPrice(revenue)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
