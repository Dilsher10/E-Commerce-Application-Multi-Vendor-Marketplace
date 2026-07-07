import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import { ArrowLeft, Edit, Package, Tag } from 'lucide-react';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { Product } from '@/models/Product';

type VendorSession = {
  id: string;
  role: 'vendor';
};

type VendorProduct = {
  _id: { toString(): string };
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images?: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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

async function getProduct(productId: string, vendorId: string) {
  if (!mongoose.isValidObjectId(productId)) return null;
  await dbConnect();
  const product = await Product.findOne({ _id: productId, vendor: vendorId }).lean();
  return product as unknown as VendorProduct | null;
}

export default async function VendorProductViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const session = token ? verifyToken(token) : null;

  if (!isVendorSession(session)) notFound();

  const product = await getProduct(id, session.id);
  if (!product) notFound();

  const productId = product._id.toString();
  const imageUrl = product.images?.[0];

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/vendor/products" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-[var(--accent-color)] mb-3">
            <ArrowLeft size={16} />
            Back to products
          </Link>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">{product.title}</h1>
          <p className="text-muted mt-1 text-sm">Vendor product preview and inventory details.</p>
        </div>
        <Link href={`/vendor/products/${productId}/edit`} className="btn bg-[var(--accent-color)] text-white hover:bg-teal-600 w-full sm:w-auto">
          <Edit size={18} />
          Edit Product
        </Link>
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
          <div className="flex flex-wrap gap-3 mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${product.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
              {product.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[var(--accent-color)] border border-teal-100">
              <Tag size={14} />
              {product.category}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] p-4">
              <p className="text-xs font-semibold text-muted mb-1">Price</p>
              <p className="text-2xl font-extrabold text-[var(--text-main)] m-0">{formatPrice(product.price)}</p>
            </div>
            <div className="rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] p-4">
              <p className="text-xs font-semibold text-muted mb-1">Stock</p>
              <p className="text-2xl font-extrabold text-[var(--text-main)] m-0">{product.stock}</p>
            </div>
            <div className="rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] p-4">
              <p className="text-xs font-semibold text-muted mb-1">Product ID</p>
              <p className="text-sm font-bold text-[var(--text-main)] m-0 truncate">{productId}</p>
            </div>
          </div>

          <div className="border-t border-[var(--border-color)] pt-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Package size={18} />
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap m-0">{product.description}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
