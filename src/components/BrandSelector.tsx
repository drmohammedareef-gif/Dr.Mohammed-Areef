import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
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
  const { setFilters, setActivePage, cars, filters } = useCars();

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
    <section className="bg-slate-50/70 py-14 sm:py-20 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Showroom Brand Selection</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight uppercase">
              Select Your Brand
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-xl">
              Choose your preferred automotive brand to filter certified vehicles currently available in our Ambasamudram showroom.
            </p>
          </div>

          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors group cursor-pointer"
          >
            <span>View All Makes & Models</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {BRANDS_LIST.map((brand) => {
            const count = cars.filter(
              (c) => c.status === 'available' && c.brand.toLowerCase() === brand.name.toLowerCase()
            ).length;
            const isSelected = filters.brand === brand.name;

            return (
              <button
                key={brand.name}
                onClick={() => handleBrandClick(brand.name)}
                className={`group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border transition-all duration-200 text-center cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 shadow-sm ring-1 ring-emerald-600'
                    : 'border-neutral-200/90 bg-white hover:border-emerald-500 hover:shadow-md hover:bg-neutral-50/50'
                }`}
              >
                {/* Brand Badge / Monogram */}
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black transition-transform group-hover:scale-110 mb-3 ${
                  isSelected 
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-800 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                }`}>
                  {brand.badge}
                </div>

                <span className="font-display text-sm font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors">
                  {brand.name}
                </span>

                <span className="text-[11px] text-neutral-500 mt-0.5">
                  {count > 0 ? `${count} In Stock` : 'Browse Brand'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
