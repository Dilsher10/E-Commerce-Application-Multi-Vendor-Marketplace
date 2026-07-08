import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import VendorProductEditForm from '@/components/VendorProductEditForm';

type VendorSession = {
  id: string;
  role: 'vendor';
};

type EditableProductDocument = {
  _id: { toString(): string };
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images?: string[];
  isActive: boolean;
};

function isVendorSession(session: unknown): session is VendorSession {
  if (typeof session !== 'object' || session === null) return false;
  const value = session as Record<string, unknown>;
  return value.role === 'vendor' && typeof value.id === 'string';
}

async function getProduct(productId: string, vendorId: string) {
  if (!mongoose.isValidObjectId(productId)) return null;
  await dbConnect();
  const product = await Product.findOne({ _id: productId, vendor: vendorId }).lean();
  return product as unknown as EditableProductDocument | null;
}

async function getCategories() {
  await dbConnect();
  const [storedCategories, productCategories] = await Promise.all([
    Category.find({ isActive: true }).select('name').sort({ name: 1 }).lean(),
    Product.distinct('category', { isActive: true }),
  ]);

  return Array.from(new Set([
    ...storedCategories.flatMap((category) => category.name ? [category.name] : []),
    ...productCategories.filter((category): category is string => Boolean(category)),
  ])).sort();
}

export default async function VendorProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const session = token ? verifyToken(token) : null;

  if (!isVendorSession(session)) notFound();

  const product = await getProduct(id, session.id);
  if (!product) notFound();
  const categories = await getCategories();

  return (
    <VendorProductEditForm
      categories={categories}
      product={{
        id: product._id.toString(),
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        isActive: product.isActive,
        imageUrl: product.images?.[0],
      }}
    />
  );
}
