import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import { ArrowLeft, BadgeDollarSign, Boxes, Package, Store, Tag } from 'lucide-react';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';

type AdminProduct = {
  _id: { toString(): string };
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images?: string[];
  isActive: boolean;
  vendor?: {
    name?: string;
    email?: string;
    vendorDetails?: {
      storeName?: string;
      phone?: string;
      city?: string;
      country?: string;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

function formatDate(date?: Date) {
  if (!date) return 'Not available';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function getStatus(product: AdminProduct) {
  if (!product.isActive) return { label: 'Inactive', className: 'bg-gray-100 text-gray-600 border border-gray-200' };
  if (product.stock === 0) return { label: 'Out of Stock', className: 'bg-red-100 text-red-700 border border-red-200' };
  if (product.stock < 10) return { label: 'Low Stock', className: 'bg-orange-100 text-orange-700 border border-orange-200' };
  return { label: 'Active', className: 'bg-green-100 text-green-700 border border-green-200' };
}

async function getProduct(productId: string) {
  if (!mongoose.isValidObjectId(productId)) return null;

  await dbConnect();
  const product = await Product.findById(productId)
    .populate('vendor', 'name email vendorDetails.storeName vendorDetails.phone vendorDetails.city vendorDetails.country')
    .lean();

  return product as unknown as AdminProduct | null;
}

export default async function AdminProductViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const productId = product._id.toString();
  const imageUrl = product.images?.[0];
  const status = getStatus(product);
  const vendorName = product.vendor?.vendorDetails?.storeName || product.vendor?.name || 'Unknown vendor';
  const vendorLocation = [product.vendor?.vendorDetails?.city, product.vendor?.vendorDetails?.country].filter(Boolean).join(', ');

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-[var(--primary-color)] mb-3">
            <ArrowLeft size={16} />
            Back to products
          </Link>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">{product.title}</h1>
          <p className="text-muted mt-1 text-sm">Admin product details and vendor information.</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
        <section className="bg-white border border-[var(--border-color)] rounded-lg p-6 shadow-sm">
          <div
            className="aspect-square rounded-lg bg-gray-100 border border-[var(--border-color)] bg-cover bg-center flex items-center justify-center"
            style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : undefined}
          >
            {!imageUrl && <span className="text-muted font-semibold">No image</span>}
          </div>
        </section>

        <section className="bg-white border border-[var(--border-color)] rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] p-4">
              <BadgeDollarSign size={20} className="text-green-600 mb-3" />
              <p className="text-xs font-semibold text-muted mb-1">Price</p>
              <p className="text-2xl font-extrabold text-[var(--text-main)] m-0">{formatPrice(product.price)}</p>
            </div>
            <div className="rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] p-4">
              <Boxes size={20} className="text-blue-600 mb-3" />
              <p className="text-xs font-semibold text-muted mb-1">Stock</p>
              <p className="text-2xl font-extrabold text-[var(--text-main)] m-0">{product.stock}</p>
            </div>
            <div className="rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] p-4">
              <Tag size={20} className="text-[var(--primary-color)] mb-3" />
              <p className="text-xs font-semibold text-muted mb-1">Category</p>
              <p className="text-sm font-bold text-[var(--text-main)] m-0">{product.category}</p>
            </div>
          </div>

          <div className="border-t border-[var(--border-color)] pt-6 mb-8">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Package size={18} />
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap m-0">{product.description}</p>
          </div>

          <div className="border-t border-[var(--border-color)] pt-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Store size={18} />
              Vendor
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted mb-1">Store</p>
                <p className="font-bold text-[var(--text-main)]">{vendorName}</p>
              </div>
              <div>
                <p className="text-muted mb-1">Email</p>
                <p className="font-bold text-[var(--text-main)]">{product.vendor?.email || 'Not available'}</p>
              </div>
              <div>
                <p className="text-muted mb-1">Location</p>
                <p className="font-bold text-[var(--text-main)]">{vendorLocation || 'Not available'}</p>
              </div>
              <div>
                <p className="text-muted mb-1">Product ID</p>
                <p className="font-bold text-[var(--text-main)] break-all">{productId}</p>
              </div>
              <div>
                <p className="text-muted mb-1">Created</p>
                <p className="font-bold text-[var(--text-main)]">{formatDate(product.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted mb-1">Updated</p>
                <p className="font-bold text-[var(--text-main)]">{formatDate(product.updatedAt)}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
