'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ImagePlus, Save } from 'lucide-react';

type EditableProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
};

export default function VendorProductEditForm({
  product,
  categories,
}: {
  product: EditableProduct;
  categories: string[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageName, setImageName] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        body: new FormData(event.currentTarget),
      });

      const data: { error?: string } = await response.json();
      if (!response.ok) throw new Error(data.error || 'Product could not be updated');

      router.push('/vendor/products');
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Product could not be updated');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/vendor/products" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-[var(--accent-color)] mb-3">
            <ArrowLeft size={16} />
            Back to products
          </Link>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Edit Product</h1>
          <p className="text-muted mt-1 text-sm">Update product details, stock, visibility, and media.</p>
        </div>
        <button type="submit" form="edit-product-form" disabled={loading} className="btn bg-[var(--accent-color)] text-white hover:bg-[var(--primary-hover)] w-full sm:w-auto">
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <form id="edit-product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <section className="bg-white border border-[var(--border-color)] rounded-lg p-6 shadow-sm">
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block mb-2 text-sm font-semibold text-[var(--text-main)]">
                Product Title
              </label>
              <input id="title" name="title" type="text" required minLength={3} defaultValue={product.title} />
            </div>

            <div>
              <label htmlFor="price" className="block mb-2 text-sm font-semibold text-[var(--text-main)]">
                Price
              </label>
              <input id="price" name="price" type="number" required min="0.01" step="0.01" defaultValue={product.price} />
            </div>

            <div>
              <label htmlFor="stock" className="block mb-2 text-sm font-semibold text-[var(--text-main)]">
                Stock
              </label>
              <input id="stock" name="stock" type="number" required min="0" step="1" defaultValue={product.stock} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="category" className="block mb-2 text-sm font-semibold text-[var(--text-main)]">
                Category
              </label>
              <select id="category" name="category" defaultValue={product.category} required>
                {!categories.includes(product.category) && (
                  <option value={product.category}>{product.category}</option>
                )}
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block mb-2 text-sm font-semibold text-[var(--text-main)]">
                Description
              </label>
              <textarea id="description" name="description" required minLength={10} rows={7} defaultValue={product.description} />
            </div>

            <label className="sm:col-span-2 flex items-center gap-3 text-sm font-semibold text-[var(--text-main)]">
              <input name="isActive" type="checkbox" defaultChecked={product.isActive} className="w-4 h-4" />
              Active product listing
            </label>
          </div>
        </section>

        <aside className="bg-white border border-[var(--border-color)] rounded-lg p-6 shadow-sm h-fit">
          <div className="mb-5">
            <h2 className="text-lg font-bold m-0">Product Image</h2>
            <p className="text-xs text-muted m-0">Upload a new image to replace the current one.</p>
          </div>

          {product.imageUrl && (
            <div className="aspect-square rounded-lg border border-[var(--border-color)] bg-gray-100 bg-cover bg-center mb-4" style={{ backgroundImage: `url("${product.imageUrl}")` }} />
          )}

          <label htmlFor="image" className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border-color)] bg-[var(--bg-color)] px-4 py-6 text-center hover:border-[var(--accent-color)] hover:bg-blue-50 transition-colors">
            <ImagePlus size={28} className="text-[var(--accent-color)] mb-3" />
            <span className="text-sm font-semibold text-[var(--text-main)]">{imageName || 'Choose replacement image'}</span>
            <span className="text-xs text-muted mt-1">Optional PNG, JPG, or WEBP</span>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => setImageName(event.target.files?.[0]?.name || '')}
            />
          </label>

          <div className="mt-6 flex flex-col gap-3">
            <button type="submit" disabled={loading} className="btn bg-[var(--accent-color)] text-white hover:bg-[var(--primary-hover)] w-full">
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/vendor/products" className="btn btn-secondary w-full">
              Cancel
            </Link>
          </div>
        </aside>
      </form>
    </div>
  );
}
