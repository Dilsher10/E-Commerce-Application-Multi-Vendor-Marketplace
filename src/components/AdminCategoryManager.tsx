'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit3, Plus, Save, Trash2, X } from 'lucide-react';

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  productCount: number;
};

type CategoryForm = {
  name: string;
  description: string;
  isActive: boolean;
};

const emptyForm: CategoryForm = {
  name: '',
  description: '',
  isActive: true,
};

export default function AdminCategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const editingCategory = categories.find((category) => category._id === editingId);

  function startEdit(category: Category) {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive,
    });
    setError('');
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  async function submitCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/categories', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          ...form,
        }),
      });
      const data: { error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Category could not be saved');
      }

      resetForm();
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Category could not be saved');
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(category: Category) {
    if (!window.confirm(`Delete "${category.name}"?`)) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: category._id }),
      });
      const data: { error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Category could not be deleted');
      }

      if (editingId === category._id) resetForm();
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Category could not be deleted');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
      <form onSubmit={submitCategory} className="bg-white border border-[var(--border-color)] rounded-lg p-6 shadow-sm h-fit">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold m-0">{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
            <p className="text-sm text-muted m-0">Categories appear in product filters and vendor product forms.</p>
          </div>
          {editingCategory && (
            <button type="button" onClick={resetForm} className="p-2 rounded-lg border border-[var(--border-color)] hover:bg-gray-50" aria-label="Cancel edit">
              <X size={18} />
            </button>
          )}
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="category-name" className="block mb-2 text-sm font-semibold text-[var(--text-main)]">
              Name
            </label>
            <input
              id="category-name"
              type="text"
              required
              minLength={2}
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Electronics & Tech"
            />
          </div>

          <div>
            <label htmlFor="category-description" className="block mb-2 text-sm font-semibold text-[var(--text-main)]">
              Description
            </label>
            <textarea
              id="category-description"
              rows={4}
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Short internal note or storefront description."
            />
          </div>

          <label className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] px-4 py-3">
            <span className="text-sm font-semibold text-[var(--text-main)]">Active category</span>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
              className="w-5 h-5"
            />
          </label>

          <button type="submit" disabled={loading} className="btn bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)] w-full">
            {editingCategory ? <Save size={18} /> : <Plus size={18} />}
            {loading ? 'Saving...' : editingCategory ? 'Save Category' : 'Create Category'}
          </button>
        </div>
      </form>

      <section className="bg-white rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <h2 className="text-xl font-bold mb-2">No categories yet</h2>
            <p className="text-muted">Create your first category to organize marketplace products.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50/80 text-muted uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4 text-right">Products</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[var(--text-main)] text-base">{category.name}</p>
                      <p className="text-xs text-muted max-w-md truncate">{category.description || 'No description'}</p>
                    </td>
                    <td className="px-6 py-4 text-muted font-mono text-xs">{category.slug}</td>
                    <td className="px-6 py-4 text-right font-bold text-[var(--text-main)]">{category.productCount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        category.isActive
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button type="button" onClick={() => startEdit(category)} className="p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-blue-50 rounded-lg transition-colors" aria-label={`Edit ${category.name}`}>
                          <Edit3 size={18} />
                        </button>
                        <button type="button" onClick={() => deleteCategory(category)} disabled={category.productCount > 0 || loading} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:hover:text-gray-400 disabled:hover:bg-transparent" aria-label={`Delete ${category.name}`}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
