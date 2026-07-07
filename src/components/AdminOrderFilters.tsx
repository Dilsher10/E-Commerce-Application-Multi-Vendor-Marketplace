'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Filter, Search, X } from 'lucide-react';

type OrderFilters = {
  q: string;
  payment: string;
  fulfillment: string;
  from: string;
  to: string;
};

export default function AdminOrderFilters({ initialFilters }: { initialFilters: OrderFilters }) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const hasFilters = Boolean(filters.q || filters.payment || filters.fulfillment || filters.from || filters.to);

  const filterUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.q.trim()) params.set('q', filters.q.trim());
    if (filters.payment) params.set('payment', filters.payment);
    if (filters.fulfillment) params.set('fulfillment', filters.fulfillment);
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);
    const query = params.toString();
    return query ? `/admin/orders?${query}` : '/admin/orders';
  }, [filters]);

  const applyFilters = useCallback((nextFilters = filters, replace = false) => {
    const params = new URLSearchParams();
    if (nextFilters.q.trim()) params.set('q', nextFilters.q.trim());
    if (nextFilters.payment) params.set('payment', nextFilters.payment);
    if (nextFilters.fulfillment) params.set('fulfillment', nextFilters.fulfillment);
    if (nextFilters.from) params.set('from', nextFilters.from);
    if (nextFilters.to) params.set('to', nextFilters.to);
    const query = params.toString();
    const href = query ? `/admin/orders?${query}` : '/admin/orders';
    if (replace) router.replace(href);
    else router.push(href);
  }, [filters, router]);

  function updateFilter(name: keyof OrderFilters, value: string, submit = false) {
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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1fr_160px_180px_150px_150px_auto] gap-3 w-full">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          name="q"
          type="search"
          placeholder="Search order ID, customer, email, or product..."
          value={filters.q}
          onChange={(event) => updateFilter('q', event.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm outline-none transition-colors shadow-sm"
        />
      </div>

      <select value={filters.payment} onChange={(event) => updateFilter('payment', event.target.value, true)} className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] shadow-sm outline-none w-full">
        <option value="">All Payments</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select value={filters.fulfillment} onChange={(event) => updateFilter('fulfillment', event.target.value, true)} className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] shadow-sm outline-none w-full">
        <option value="">All Fulfillment</option>
        <option value="unfulfilled">Unfulfilled</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <input
        type="date"
        value={filters.from}
        onChange={(event) => updateFilter('from', event.target.value, true)}
        className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] shadow-sm outline-none w-full"
        aria-label="From date"
      />

      <input
        type="date"
        value={filters.to}
        onChange={(event) => updateFilter('to', event.target.value, true)}
        className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-semibold text-[var(--text-main)] shadow-sm outline-none w-full"
        aria-label="To date"
      />

      <div className="flex gap-2">
        <button type="submit" className="btn bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)] w-full xl:w-auto">
          <Filter size={16} />
          Filter
        </button>
        {hasFilters && (
          <Link href="/admin/orders" className="btn btn-secondary w-full xl:w-auto" title="Clear filters">
            <X size={16} />
          </Link>
        )}
      </div>

      <input type="hidden" name="filterUrl" value={filterUrl} readOnly />
    </form>
  );
}
