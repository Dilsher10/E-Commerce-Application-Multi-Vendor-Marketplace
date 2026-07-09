'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';

const brands = ['Apple', 'Samsung', 'Sony', 'Bose', 'DJI', 'Logitech', 'Canon', 'Microsoft'];

export default function BrandSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollToBrand(index: number) {
    setActiveIndex(index);
    trackRef.current?.children[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }

  function goToPrevious() {
    scrollToBrand((activeIndex - 1 + brands.length) % brands.length);
  }

  function goToNext() {
    scrollToBrand((activeIndex + 1) % brands.length);
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
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {brands.map((brand) => (
            <div
              key={brand}
              className="h-24 flex-none basis-[calc((100%_-_1rem)_/_2)] snap-start rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] flex items-center justify-center text-xl md:text-2xl font-black text-[var(--secondary-color)] tracking-normal grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-[var(--primary-color)] transition-all duration-300 sm:basis-[calc((100%_-_2rem)_/_3)] lg:basis-[calc((100%_-_3rem)_/_4)]"
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
            onClick={() => scrollToBrand(index)}
            className={`h-2.5 rounded-full transition-all ${activeIndex === index ? 'w-8 bg-[var(--primary-color)]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
            aria-label={`Show ${brand}`}
            aria-current={activeIndex === index ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
