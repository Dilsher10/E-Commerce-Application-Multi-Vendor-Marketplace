import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import { ArrowLeft, CheckCircle2, Clock, CreditCard, MapPin, Package, Truck, User, XCircle } from 'lucide-react';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';

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
      images?: string[];
    };
    vendor?: {
      name?: string;
      vendorDetails?: {
        storeName?: string;
      };
    };
  }>;
  totalAmount: number;
  stripeSessionId?: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
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
    hour: 'numeric',
    minute: '2-digit',
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

async function getOrder(orderId: string) {
  if (!mongoose.isValidObjectId(orderId)) return null;

  await dbConnect();
  const order = await Order.findById(orderId)
    .populate('user', 'name email')
    .populate('items.product', 'title images')
    .populate('items.vendor', 'name vendorDetails.storeName')
    .lean();

  return order as unknown as AdminOrder | null;
}

export default async function AdminOrderViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  const orderId = order._id.toString();
  const paymentStatus = getPaymentStatus(order.status);
  const fulfillment = getFulfillmentStatus(order.status);
  const FulfillmentIcon = fulfillment.icon;
  const itemSubtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-[var(--primary-color)] mb-3">
            <ArrowLeft size={16} />
            Back to orders
          </Link>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Order #{orderId}</h1>
          <p className="text-muted mt-1 text-sm">Placed {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getPaymentStatusBadge(paymentStatus)}`}>
            {paymentStatus}
          </span>
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 border border-gray-200 ${fulfillment.color}`}>
            <FulfillmentIcon size={14} />
            {fulfillment.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <section className="bg-white border border-[var(--border-color)] rounded-lg shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[var(--border-color)] bg-gray-50/70">
            <h2 className="text-lg font-bold m-0 flex items-center gap-2">
              <Package size={18} />
              Ordered Items
            </h2>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {order.items.map((item, index) => {
              const imageUrl = item.product?.images?.[0];
              const vendorName = item.vendor?.vendorDetails?.storeName || item.vendor?.name || 'Unknown vendor';

              return (
                <div key={`${orderId}-${index}`} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg bg-gray-100 border border-[var(--border-color)] flex-shrink-0 bg-cover bg-center"
                    style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : undefined}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[var(--text-main)] mb-1">{item.product?.title || 'Product unavailable'}</p>
                    <p className="text-xs text-muted m-0">Vendor: {vendorName}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-right w-full sm:w-auto">
                    <div>
                      <p className="text-xs text-muted mb-1">Qty</p>
                      <p className="font-bold text-[var(--text-main)] m-0">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">Price</p>
                      <p className="font-bold text-[var(--text-main)] m-0">{formatPrice(item.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">Total</p>
                      <p className="font-extrabold text-[var(--text-main)] m-0">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <section className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CreditCard size={18} />
              Payment Summary
            </h2>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-muted">Items subtotal</span>
              <span className="font-bold text-[var(--text-main)]">{formatPrice(itemSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-muted">Recorded total</span>
              <span className="font-bold text-[var(--text-main)]">{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="border-t border-[var(--border-color)] pt-4 mt-4">
              <p className="text-xs text-muted mb-1">Stripe Session</p>
              <p className="font-semibold text-[var(--text-main)] break-all m-0">{order.stripeSessionId || 'Not available'}</p>
            </div>
          </section>

          <section className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User size={18} />
              Customer
            </h2>
            <p className="font-bold text-[var(--text-main)] mb-1">{order.user?.name || 'Guest Customer'}</p>
            <p className="text-sm text-muted m-0">{order.user?.email || 'No email'}</p>
          </section>

          <section className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MapPin size={18} />
              Shipping Address
            </h2>
            <div className="text-sm text-[var(--text-main)] leading-6">
              <p className="m-0">{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p className="m-0">{order.shippingAddress.line2}</p>}
              <p className="m-0">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}</p>
              <p className="m-0">{order.shippingAddress.country}</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
