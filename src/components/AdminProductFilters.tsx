'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Filter, Search, X } from 'lucide-react';

type AdminVendorFilter = {
  id: string;
  name: string;
};

type ProductFilters = {
  q: string;
  category: string;
  status: string;
  vendor: string;
};

export default function AdminProductFilters({
  categories,
  vendors,
  initialFilters,
}: {
  categories: string[];
  vendors: AdminVendorFilter[];
  initialFilters: ProductFilters;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const hasFilters = Boolean(filters.q || filters.category || filters.status || filters.vendor);

  const filterUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.q.trim()) params.set('q', filters.q.trim());
    if (filters.category) params.set('category', filters.category);
    if (filters.status) params.set('status', filters.status);
    if (filters.vendor) params.set('vendor', filters.vendor);
    const query = params.toString();
    return query ? `/admin/products?${query}` : '/admin/products';
  }, [filters]);

  const applyFilters = useCallback((nextFilters = filters, replace = false) => {
    const params = new URLSearchParams();
    if (nextFilters.q.trim()) params.set('q', nextFilters.q.trim());
    if (nextFilters.category) params.set('category', nextFilters.category);
    if (nextFilters.status) params.set('status', nextFilters.status);
    if (nextFilters.vendor) params.set('vendor', nextFilters.vendor);
    const query = params.toString();
    const href = query ? `/admin/products?${query}` : '/admin/products';
    if (replace) router.replace(href);
    else router.push(href);
  }, [filters, router]);

  function updateFilter(name: keyof ProductFilters, value: string, submit = false) {
    const nextFilters = { ...filters, [name]: value };
    setFilters(nextFilters);
    if (submit) applyFilters(nextFilters);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFilters();
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      applyFilters(filters, true);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [applyFilters, filters]);

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-5">
      <div className="relative">
        <input
          name="q"
          type="search"
          placeholder="Search title, category, or description..."
          value={filters.q}
          onChange={(event) => updateFilter('q', event.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm outline-none transition-colors shadow-sm"
        />
      </div>

      <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value, true)} className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] shadow-sm outline-none w-full">
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value, true)} className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] shadow-sm outline-none w-full">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="low-stock">Low Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </select>

      <select value={filters.vendor} onChange={(event) => updateFilter('vendor', event.target.value, true)} className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] shadow-sm outline-none w-full">
        <option value="">All Vendors</option>
        {vendors.map((vendor) => (
          <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
        ))}
      </select>

      <input type="hidden" name="filterUrl" value={filterUrl} readOnly />
    </form>
  );
}
