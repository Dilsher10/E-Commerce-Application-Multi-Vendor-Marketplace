import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminProducts() {
  const products = [
    { id: 'PRD-001', name: 'Quantum Pro Wireless Earbuds', category: 'Audio', price: '$149.99', stock: 124, status: 'Active', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=150&auto=format&fit=crop' },
    { id: 'PRD-002', name: 'AeroBook Ultra 14" Laptop', category: 'Laptops', price: '$1,299.00', stock: 15, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=150&auto=format&fit=crop' },
    { id: 'PRD-003', name: 'Horizon Smartwatch Series 5', category: 'Wearables', price: '$299.50', stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=150&auto=format&fit=crop' },
    { id: 'PRD-004', name: 'Nexus 4K Creator Monitor', category: 'Displays', price: '$499.00', stock: 45, status: 'Active', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=150&auto=format&fit=crop' },
    { id: 'PRD-005', name: 'Echo Plus Smart Speaker', category: 'Smart Home', price: '$99.99', stock: 320, status: 'Active', image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=150&auto=format&fit=crop' },
    { id: 'PRD-006', name: 'ProCam X1 Action Camera', category: 'Cameras', price: '$249.00', stock: 8, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=150&auto=format&fit=crop' },
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Products</h1>
          <p className="text-muted mt-1 text-sm">Manage your inventory, pricing, and product visibility.</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--primary-color)] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors">
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar (Search & Filters) */}
        <div className="p-4 sm:p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Search products by name, ID, or category..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm focus:border-[var(--primary-color)] outline-none transition-colors shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto justify-center">
              <Filter size={16} />
              Filters
            </button>
            <select className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] hover:bg-gray-50 transition-colors shadow-sm outline-none w-full sm:w-auto cursor-pointer">
              <option>All Categories</option>
              <option>Audio</option>
              <option>Laptops</option>
              <option>Wearables</option>
              <option>Cameras</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 text-muted uppercase text-xs font-bold tracking-wider">
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
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-[var(--border-color)] flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-[var(--text-main)] text-base group-hover:text-[var(--primary-color)] transition-colors cursor-pointer">{product.name}</p>
                        <p className="text-xs text-muted font-medium">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-semibold text-xs border border-gray-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-extrabold text-[var(--text-main)] text-base">
                    {product.price}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold ${product.stock < 10 ? 'text-red-600' : 'text-[var(--text-main)]'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${product.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 
                        product.status === 'Low Stock' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 
                        'bg-red-100 text-red-700 border border-red-200'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-blue-50 rounded-lg transition-colors" title="View">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 sm:p-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <p className="text-sm text-muted font-medium">Showing <span className="font-bold text-[var(--text-main)]">1</span> to <span className="font-bold text-[var(--text-main)]">6</span> of <span className="font-bold text-[var(--text-main)]">1,423</span> products</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-[var(--border-color)] bg-white rounded-lg text-sm font-semibold text-gray-400 cursor-not-allowed shadow-sm">
              Previous
            </button>
            <div className="hidden sm:flex items-center gap-1">
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--primary-color)] text-white font-bold shadow-sm">1</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[var(--border-color)] text-muted hover:bg-gray-50 font-bold transition-colors shadow-sm">2</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[var(--border-color)] text-muted hover:bg-gray-50 font-bold transition-colors shadow-sm">3</button>
              <span className="text-muted px-1">...</span>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[var(--border-color)] text-muted hover:bg-gray-50 font-bold transition-colors shadow-sm">237</button>
            </div>
            <button className="px-4 py-2 border border-[var(--border-color)] bg-white rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm text-[var(--text-main)]">
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
