import Link from 'next/link';
import { cookies } from 'next/headers';
import { Box, PackagePlus, Search } from 'lucide-react';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { Product } from '@/models/Product';
import VendorProductActions from '@/components/VendorProductActions';

type VendorSession = {
  id: string;
  role: 'vendor';
};

type VendorProduct = {
  _id: { toString(): string };
  title: string;
  category: string;
  price: number;
  stock: number;
  images?: string[];
  isActive: boolean;
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

function getStatus(product: VendorProduct) {
  if (!product.isActive) return { label: 'Inactive', className: 'bg-gray-100 text-gray-600 border border-gray-200' };
  if (product.stock === 0) return { label: 'Out of Stock', className: 'bg-red-100 text-red-700 border border-red-200' };
  if (product.stock < 10) return { label: 'Low Stock', className: 'bg-orange-100 text-orange-700 border border-orange-200' };
  return { label: 'Active', className: 'bg-green-100 text-green-700 border border-green-200' };
}

async function getVendorProducts(vendorId: string) {
  await dbConnect();
  const products = await Product.find({ vendor: vendorId })
    .select('title category price stock images isActive createdAt')
    .sort({ createdAt: -1 })
    .lean();

  return products as unknown as VendorProduct[];
}

export default async function VendorProductsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const session = token ? verifyToken(token) : null;
  const products = isVendorSession(session) ? await getVendorProducts(session.id) : [];

  const activeCount = products.filter((product) => product.isActive).length;
  const lowStockCount = products.filter((product) => product.isActive && product.stock > 0 && product.stock < 10).length;
  const outOfStockCount = products.filter((product) => product.stock === 0).length;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">My Products</h1>
          <p className="text-muted mt-1 text-sm">Track the products published from your vendor account.</p>
        </div>
        <Link href="/vendor/products/new" className="btn bg-[var(--accent-color)] text-white hover:bg-[var(--primary-hover)] w-full sm:w-auto">
          <PackagePlus size={18} />
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Total Products</p>
          <p className="text-3xl font-extrabold text-[var(--text-main)] m-0">{products.length}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Active Listings</p>
          <p className="text-3xl font-extrabold text-green-600 m-0">{activeCount}</p>
        </div>
        <div className="bg-white border border-[var(--border-color)] rounded-lg p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-1">Stock Alerts</p>
          <p className="text-3xl font-extrabold text-orange-500 m-0">{lowStockCount + outOfStockCount}</p>
        </div>
      </div>

      <div className="bg-white border border-[var(--border-color)] rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[var(--accent-color)] flex items-center justify-center">
              <Box size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold m-0">Product Inventory</h2>
              <p className="text-xs text-muted m-0">Newest products appear first.</p>
            </div>
          </div>
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="search" placeholder="Search coming soon" disabled className="pl-10 bg-white disabled:opacity-70" />
          </div>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-lg bg-[var(--bg-color)] text-muted flex items-center justify-center mb-4">
              <Box size={26} />
            </div>
            <h3 className="text-xl font-bold mb-2">No products yet</h3>
            <p className="text-muted mb-6 max-w-md">Add your first product to start building your storefront inventory.</p>
            <Link href="/vendor/products/new" className="btn bg-[var(--accent-color)] text-white hover:bg-[var(--primary-hover)]">
              <PackagePlus size={18} />
              Add Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50 text-muted uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-right">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {products.map((product) => {
                  const status = getStatus(product);
                  const productId = product._id.toString();
                  const imageUrl = product.images?.[0];

                  return (
                    <tr key={productId} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-14 h-14 rounded-lg bg-gray-100 border border-[var(--border-color)] flex-shrink-0 bg-cover bg-center"
                            style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : undefined}
                          >
                            {!imageUrl && <div className="w-full h-full flex items-center justify-center text-xs text-muted">No image</div>}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--text-main)] text-base mb-1">{product.title}</p>
                            <p className="text-xs text-muted font-medium">{productId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-semibold text-xs border border-gray-200">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-[var(--text-main)] text-base">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-bold ${product.stock < 10 ? 'text-orange-600' : 'text-[var(--text-main)]'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <VendorProductActions productId={productId} productTitle={product.title} />
                      </td>
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
