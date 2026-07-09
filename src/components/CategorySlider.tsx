'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Headphones, Monitor, Smartphone, Watch } from 'lucide-react';
import { useRef, useState } from 'react';

type CategoryItem = {
  name: string;
  count: number;
};

const categoryStyles = [
  { icon: Headphones, color: 'bg-blue-100 text-blue-600' },
  { icon: Monitor, color: 'bg-purple-100 text-purple-600' },
  { icon: Watch, color: 'bg-orange-100 text-orange-600' },
  { icon: Smartphone, color: 'bg-green-100 text-green-600' },
];

function formatCount(count: number) {
  return `${count.toLocaleString()} ${count === 1 ? 'item' : 'items'}`;
}

export default function CategorySlider({ categories }: { categories: CategoryItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  if (categories.length === 0) {
    return null;
  }

  function scrollToCategory(index: number) {
    setActiveIndex(index);
    trackRef.current?.children[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }

  function goToPrevious() {
    scrollToCategory((activeIndex - 1 + categories.length) % categories.length);
  }

  function goToNext() {
    scrollToCategory((activeIndex + 1) % categories.length);
  }

  return (
    <div>
      <div className="flex justify-between items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold m-0">Explore Categories</h2>
        <div className="flex items-center gap-2">
          <Link href="/products" className="text-[var(--primary-color)] font-semibold text-sm hover:underline mr-2">
            See All
          </Link>
          <button
            type="button"
            onClick={goToPrevious}
            className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white text-[var(--text-main)] inline-flex items-center justify-center hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]"
            aria-label="Previous category"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white text-[var(--text-main)] inline-flex items-center justify-center hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]"
            aria-label="Next category"
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
          {categories.map((category, index) => {
            const style = categoryStyles[index % categoryStyles.length];
            const Icon = style.icon;

            return (
              <Link
                href={`/products?category=${encodeURIComponent(category.name)}`}
                key={category.name}
                className="flex-none basis-[calc((100%_-_1.25rem)_/_2)] snap-start flex items-center gap-6 p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-color)] hover:bg-white hover:border-[var(--primary-color)] transition-all group shadow-sm hover:shadow-md md:basis-[calc((100%_-_3.75rem)_/_4)]"
              >
                <div className={`w-16 h-16 rounded-xl ${style.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold m-0 group-hover:text-[var(--primary-color)] transition-colors truncate">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted m-0 mt-1">{formatCount(category.count)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {categories.map((category, index) => (
          <button
            key={category.name}
            type="button"
            onClick={() => scrollToCategory(index)}
            className={`h-2.5 rounded-full transition-all ${activeIndex === index ? 'w-8 bg-[var(--primary-color)]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
            aria-label={`Show ${category.name}`}
            aria-current={activeIndex === index ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
