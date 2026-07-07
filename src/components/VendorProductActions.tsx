'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Eye, Trash2 } from 'lucide-react';

export default function VendorProductActions({
  productId,
  productTitle,
}: {
  productId: string;
  productTitle: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${productTitle}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      const data: { error?: string } = await response.json();
      if (!response.ok) throw new Error(data.error || 'Product could not be deleted');

      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Product could not be deleted');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center justify-end gap-2">
        <Link href={`/vendor/products/${productId}`} className="p-2 text-gray-400 hover:text-[var(--accent-color)] hover:bg-teal-50 rounded-lg transition-colors" title="View product">
          <Eye size={18} />
        </Link>
        <Link href={`/vendor/products/${productId}/edit`} className="p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-blue-50 rounded-lg transition-colors" title="Edit product">
          <Edit size={18} />
        </Link>
        <button type="button" onClick={handleDelete} disabled={deleting} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Delete product">
          <Trash2 size={18} />
        </button>
      </div>
      {error && <p className="text-xs text-red-600 m-0 max-w-52 whitespace-normal">{error}</p>}
    </div>
  );
}
