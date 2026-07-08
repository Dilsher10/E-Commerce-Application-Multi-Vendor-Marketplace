import { Tags } from 'lucide-react';
import dbConnect from '@/lib/db';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import AdminCategoryManager from '@/components/AdminCategoryManager';

type CategoryDocument = {
  _id: { toString(): string };
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
};

async function getCategoryData() {
  await dbConnect();

  const [categories, productCounts] = await Promise.all([
    Category.find({}).sort({ name: 1 }).lean<CategoryDocument[]>(),
    Product.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]),
  ]);

  const countsByCategory = new Map(productCounts.map((item) => [item._id, item.count]));

  return categories.map((category) => ({
    _id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    isActive: category.isActive,
    productCount: countsByCategory.get(category.name) || 0,
  }));
}

export default async function AdminCategoriesPage() {
  const categories = await getCategoryData();
  const activeCount = categories.filter((category) => category.isActive).length;
  const productLinkedCount = categories.filter((category) => category.productCount > 0).length;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Categories</h1>
          <p className="text-muted mt-1 text-sm">Create and manage product categories for the marketplace catalog.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[var(--primary-color)] flex items-center justify-center mb-3">
            <Tags size={20} />
          </div>
          <p className="text-sm font-semibold text-muted mb-1">Total Categories</p>
          <p className="text-3xl font-extrabold text-[var(--text-main)] m-0">{categories.length}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Active</p>
          <p className="text-3xl font-extrabold text-green-600 m-0">{activeCount}</p>
          <p className="text-xs text-muted mt-2 m-0">Visible to product forms and filters</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">In Use</p>
          <p className="text-3xl font-extrabold text-orange-500 m-0">{productLinkedCount}</p>
          <p className="text-xs text-muted mt-2 m-0">Categories assigned to products</p>
        </div>
      </div>

      <AdminCategoryManager categories={categories} />
    </div>
  );
}
