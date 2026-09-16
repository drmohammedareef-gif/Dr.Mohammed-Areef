import React from 'react';
import { ArrowRight, Car } from 'lucide-react';
import { useCars } from '../context/CarContext';

interface BrandItem {
  name: string;
  badge: string;
  tagline: string;
}

const BRANDS_LIST: BrandItem[] = [
  { name: 'Mercedes-Benz', badge: 'MB', tagline: 'Luxury & Refinement' },
  { name: 'BMW', badge: 'BMW', tagline: 'Ultimate Driving' },
  { name: 'Audi', badge: 'AUDI', tagline: 'Vorsprung durch Technik' },
  { name: 'Jaguar', badge: 'JAG', tagline: 'Grace & Performance' },
  { name: 'Toyota', badge: 'TYT', tagline: 'Legendary Reliability' },
  { name: 'Hyundai', badge: 'HYU', tagline: 'Modern Technology' },
  { name: 'Kia', badge: 'KIA', tagline: 'Bold Styling' },
  { name: 'Mahindra', badge: 'M&M', tagline: 'Rugged & Capable' },
  { name: 'Maruti Suzuki', badge: 'MS', tagline: 'Efficiency & Trust' },
  { name: 'Tata', badge: 'TATA', tagline: 'Safety & Strength' },
  { name: 'Honda', badge: 'HND', tagline: 'Engineering Precision' },
];

export const BrandSelector: React.FC = () => {
  const { setFilters, setActivePage, cars } = useCars();

  const handleBrandClick = (brandName: string) => {
    setFilters((prev) => ({
      ...prev,
      brand: brandName,
    }));
    setActivePage('cars');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAll = () => {
    setFilters((prev) => ({
      ...prev,
      brand: 'All Brands',
    }));
    setActivePage('cars');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="bg-neutral-950 py-14 sm:py-20 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-red-600/30 bg-red-600/10 px-3 py-1 text-xs font-bold text-red-400 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>Showroom Selection</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">
              SELECT YOUR CAR BY BRAND
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400 max-w-xl">
              Filter our certified inventory by trusted automotive manufacturers. Find the brand that matches your lifestyle.
            </p>
          </div>

          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-red-500 hover:text-red-400 transition-colors group cursor-pointer"
          >
            <span>View All Makes & Models</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {BRANDS_LIST.map((b) => {
            const count = cars.filter(
              (c) => c.status === 'available' && c.brand.toLowerCase() === b.name.toLowerCase()
            ).length;

            return (
              <button
                key={b.name}
                onClick={() => handleBrandClick(b.name)}
                className="group relative flex flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 sm:p-5 text-center transition-all duration-300 hover:border-red-600 hover:bg-neutral-900 hover:shadow-xl hover:shadow-red-950/30 active:scale-95 cursor-pointer"
              >
                {/* Brand Badge */}
                <div className="relative mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-neutral-950 border border-neutral-800 group-hover:border-red-600/60 group-hover:bg-red-600/10 transition-all shadow-inner">
                  <span className="font-display text-xs sm:text-sm font-black text-white group-hover:text-red-400 tracking-wider">
                    {b.badge}
                  </span>
                </div>

                <h3 className="font-display text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                  {b.name}
                </h3>
                <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                  {b.tagline}
                </p>

                {count > 0 && (
                  <span className="mt-2 inline-flex items-center rounded-full bg-red-600/20 border border-red-600/40 px-2 py-0.5 text-[9px] font-bold text-red-300">
                    {count} Available
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
