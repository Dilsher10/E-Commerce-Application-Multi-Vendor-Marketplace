import mongoose from 'mongoose';
import { Eye, Filter, Package, Search, X } from 'lucide-react';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { User } from '@/models/User';

type AdminProduct = {
  _id: { toString(): string };
  title: string;
  category: string;
  price: number;
  stock: number;
  images?: string[];
  isActive: boolean;
  vendor?: {
    name?: string;
    vendorDetails?: {
      storeName?: string;
    };
  };
  createdAt?: Date;
};

type AdminVendorFilter = {
  _id: { toString(): string };
  name?: string;
  vendorDetails?: {
    storeName?: string;
  };
};

type ProductFilters = {
  q: string;
  category: string;
  status: string;
  vendor: string;
};

type ProductQuery = {
  $or?: Array<{ title?: RegExp; category?: RegExp; description?: RegExp }>;
  category?: string;
  vendor?: mongoose.Types.ObjectId;
  isActive?: boolean;
  stock?: number | { $gt?: number; $lt?: number };
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

function getStatus(product: AdminProduct) {
  if (!product.isActive) return { label: 'Inactive', className: 'bg-gray-100 text-gray-600 border border-gray-200' };
  if (product.stock === 0) return { label: 'Out of Stock', className: 'bg-red-100 text-red-700 border border-red-200' };
  if (product.stock < 10) return { label: 'Low Stock', className: 'bg-orange-100 text-orange-700 border border-orange-200' };
  return { label: 'Active', className: 'bg-green-100 text-green-700 border border-green-200' };
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function buildProductQuery(filters: ProductFilters) {
  const query: ProductQuery = {};

  if (filters.q) {
    const pattern = new RegExp(filters.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ title: pattern }, { category: pattern }, { description: pattern }];
  }

  if (filters.category) query.category = filters.category;
  if (filters.vendor && mongoose.isValidObjectId(filters.vendor)) {
    query.vendor = new mongoose.Types.ObjectId(filters.vendor);
  }

  if (filters.status === 'active') query.isActive = true;
  if (filters.status === 'inactive') query.isActive = false;
  if (filters.status === 'low-stock') {
    query.isActive = true;
    query.stock = { $gt: 0, $lt: 10 };
  }
  if (filters.status === 'out-of-stock') query.stock = 0;

  return query;
}

async function getProductData(filters: ProductFilters) {
  await dbConnect();
  const query = buildProductQuery(filters);

  const [products, allProducts, vendors] = await Promise.all([
    Product.find(query)
      .populate('vendor', 'name vendorDetails.storeName')
      .sort({ createdAt: -1 })
      .lean(),
    Product.find({}).select('category').lean(),
    User.find({ role: 'vendor' }).select('name vendorDetails.storeName').sort({ name: 1 }).lean(),
  ]);

  return {
    products: products as unknown as AdminProduct[],
    categories: Array.from(new Set((allProducts as Array<{ category?: string }>).map((product) => product.category).filter(Boolean))).sort(),
    vendors: vendors as unknown as AdminVendorFilter[],
  };
}

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const filters = {
    q: getParam(params.q).trim(),
    category: getParam(params.category),
    status: getParam(params.status),
    vendor: getParam(params.vendor),
  };
  const { products, categories, vendors } = await getProductData(filters);
  const activeCount = products.filter((product) => product.isActive).length;
  const lowStockCount = products.filter((product) => product.isActive && product.stock > 0 && product.stock < 10).length;
  const outOfStockCount = products.filter((product) => product.stock === 0).length;
  const hasFilters = Boolean(filters.q || filters.category || filters.status || filters.vendor);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Products</h1>
          <p className="text-muted mt-1 text-sm">Review products listed by marketplace vendors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Total Products</p>
          <p className="text-3xl font-extrabold text-[var(--text-main)] m-0">{products.length}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Active</p>
          <p className="text-3xl font-extrabold text-green-600 m-0">{activeCount}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Low Stock</p>
          <p className="text-3xl font-extrabold text-orange-500 m-0">{lowStockCount}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Out of Stock</p>
          <p className="text-3xl font-extrabold text-red-500 m-0">{outOfStockCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 border-b border-[var(--border-color)] bg-gray-50/50">
          <form action="/admin/products" className="grid grid-cols-1 lg:grid-cols-[1fr_180px_180px_220px_auto] gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                name="q"
                type="search"
                placeholder="Search title, category, or description..."
                defaultValue={filters.q}
                className="w-full pl-10 pr-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm outline-none transition-colors shadow-sm"
              />
            </div>

            <select name="category" defaultValue={filters.category} className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] shadow-sm outline-none w-full">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select name="status" defaultValue={filters.status} className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] shadow-sm outline-none w-full">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>

            <select name="vendor" defaultValue={filters.vendor} className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] shadow-sm outline-none w-full">
              <option value="">All Vendors</option>
              {vendors.map((vendor) => {
                const vendorId = vendor._id.toString();
                const vendorName = vendor.vendorDetails?.storeName || vendor.name || 'Unnamed vendor';
                return <option key={vendorId} value={vendorId}>{vendorName}</option>;
              })}
            </select>

            <div className="flex gap-2">
              <button type="submit" className="btn bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)] w-full lg:w-auto">
                <Filter size={16} />
                Filter
              </button>
              {hasFilters && (
                <Link href="/admin/products" className="btn btn-secondary w-full lg:w-auto" title="Clear filters">
                  <X size={16} />
                </Link>
              )}
            </div>
          </form>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-lg bg-[var(--bg-color)] text-muted flex items-center justify-center mb-4">
              <Package size={26} />
            </div>
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <p className="text-muted max-w-md">Products will appear here after vendors add listings.</p>
            {hasFilters && <Link href="/admin/products" className="btn btn-secondary mt-5">Clear Filters</Link>}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50/80 text-muted uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Vendor</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Price</th>
                    <th className="px-6 py-4 text-right">Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {products.map((product) => {
                    const productId = product._id.toString();
                    const imageUrl = product.images?.[0];
                    const status = getStatus(product);
                    const vendorName = product.vendor?.vendorDetails?.storeName || product.vendor?.name || 'Unknown vendor';

                    return (
                      <tr key={productId} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-lg bg-gray-100 border border-[var(--border-color)] flex-shrink-0 bg-cover bg-center"
                              style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : undefined}
                            >
                              {!imageUrl && <div className="w-full h-full flex items-center justify-center text-[10px] text-muted">No image</div>}
                            </div>
                            <div>
                              <p className="font-bold text-[var(--text-main)] text-base group-hover:text-[var(--primary-color)] transition-colors">{product.title}</p>
                              <p className="text-xs text-muted font-medium">{productId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-[var(--text-main)]">{vendorName}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-semibold text-xs border border-gray-200">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-[var(--text-main)] text-base">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-bold ${product.stock < 10 ? 'text-red-600' : 'text-[var(--text-main)]'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/admin/products/${productId}`} className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-blue-50 rounded-lg transition-colors" title="View product">
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
                Showing <span className="font-bold text-[var(--text-main)]">{products.length}</span> products{hasFilters ? ' matching filters' : ''}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
