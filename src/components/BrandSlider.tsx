'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

const brands = ['Apple', 'Samsung', 'Sony', 'Bose', 'DJI', 'Logitech', 'Canon', 'Microsoft'];

export default function BrandSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleBrands = useMemo(
    () => brands.map((brand, index) => brands[(activeIndex + index) % brands.length]),
    [activeIndex]
  );

  function goToPrevious() {
    setActiveIndex((current) => (current - 1 + brands.length) % brands.length);
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % brands.length);
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4 mb-7">
        <p className="text-sm font-semibold text-muted uppercase tracking-wider m-0">
          Trusted by global leading brands
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPrevious}
            className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white text-[var(--text-main)] inline-flex items-center justify-center hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]"
            aria-label="Previous brand"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white text-[var(--text-main)] inline-flex items-center justify-center hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]"
            aria-label="Next brand"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleBrands.slice(0, 4).map((brand) => (
            <div
              key={brand}
              className="h-24 rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] flex items-center justify-center text-xl md:text-2xl font-black text-[var(--secondary-color)] tracking-normal grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-[var(--primary-color)] transition-all duration-300"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {brands.map((brand, index) => (
          <button
            key={brand}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${activeIndex === index ? 'w-8 bg-[var(--primary-color)]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
            aria-label={`Show ${brand}`}
            aria-current={activeIndex === index ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
