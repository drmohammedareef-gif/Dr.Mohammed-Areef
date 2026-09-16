import React, { useMemo } from 'react';
import { 
  Search, 
  RotateCcw, 
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import { FilterState, Car } from '../types';
import { POPULAR_BRANDS } from '../data/sampleCars';

interface CarFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  totalFiltered: number;
  totalAll: number;
  cars?: Car[];
}

export const CarFilters: React.FC<CarFiltersProps> = ({
  filters,
  setFilters,
  resetFilters,
  totalFiltered,
  totalAll,
  cars = [],
}) => {
  // Compute available models based on selected brand
  const availableModels = useMemo(() => {
    const relevantCars = filters.brand && filters.brand !== 'All Brands'
      ? cars.filter((c) => c.brand === filters.brand)
      : cars;
    const modelSet = new Set<string>();
    relevantCars.forEach((c) => {
      if (c.model) modelSet.add(c.model);
    });
    return Array.from(modelSet).sort();
  }, [cars, filters.brand]);

  // Compute available locations based on cars
  const availableLocations = useMemo(() => {
    const locSet = new Set<string>();
    cars.forEach((c) => {
      if (c.location) locSet.add(c.location.trim());
    });
    return Array.from(locSet).sort();
  }, [cars]);

  const isFiltered =
    filters.search !== '' ||
    filters.brand !== 'All Brands' ||
    Boolean(filters.model && filters.model !== 'All Models') ||
    filters.priceRange !== 'all' ||
    filters.year !== 'all' ||
    filters.fuelType !== 'all' ||
    filters.transmission !== 'all' ||
    filters.bodyType !== 'all' ||
    Boolean(filters.location && filters.location !== 'all') ||
    filters.status !== 'all' ||
    filters.sortBy !== 'featured';

  const handleBrandChange = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brand,
      model: '', // Reset model when brand changes
    }));
  };

  return (
    <div className="rounded-3xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-md">
      {/* Top search & quick controls bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Search by car name, model (e.g. Swift, Creta, Thar, Innova, BMW)..."
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-12 text-sm text-neutral-900 placeholder-neutral-400 focus:border-emerald-600 focus:bg-white focus:outline-none"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort by dropdown & Result badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-semibold">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as FilterState['sortBy'],
                }))
              }
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Year: Newest First</option>
              <option value="km-asc">KM: Lowest First</option>
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-100 px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Selectors Grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 border-t border-neutral-100 pt-4">
        {/* Brand */}
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Brand
          </label>
          <select
            value={filters.brand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs font-medium text-neutral-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            {POPULAR_BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Model
          </label>
          <select
            value={filters.model || 'All Models'}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                model: e.target.value === 'All Models' ? '' : e.target.value,
              }))
            }
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs font-medium text-neutral-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            <option value="All Models">All Models</option>
            {availableModels.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Budget / Price Range */}
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Price Range
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: e.target.value }))}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs font-medium text-neutral-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            <option value="all">All Prices</option>
            <option value="under3">Under ₹3 Lakh</option>
            <option value="3to6">₹3 Lakh – ₹6 Lakh</option>
            <option value="6to10">₹6 Lakh – ₹10 Lakh</option>
            <option value="above10">Above ₹10 Lakh</option>
          </select>
        </div>

        {/* Manufacturing Year */}
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Year
          </label>
          <select
            value={filters.year}
            onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs font-medium text-neutral-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            <option value="all">All Years</option>
            <option value="2022+">2022 & Newer</option>
            <option value="2020-2021">2020 – 2021</option>
            <option value="2018-2019">2018 – 2019</option>
            <option value="older">2017 & Older</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Fuel Type
          </label>
          <select
            value={filters.fuelType}
            onChange={(e) => setFilters((prev) => ({ ...prev, fuelType: e.target.value }))}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs font-medium text-neutral-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            <option value="all">All Fuels</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG">CNG</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Transmission
          </label>
          <select
            value={filters.transmission}
            onChange={(e) => setFilters((prev) => ({ ...prev, transmission: e.target.value }))}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs font-medium text-neutral-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            <option value="all">All Transmissions</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic / AMT / CVT</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Location
          </label>
          <select
            value={filters.location || 'all'}
            onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs font-medium text-neutral-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            <option value="all">All Locations</option>
            {availableLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Availability
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs font-medium text-neutral-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            <option value="all">All Vehicles</option>
            <option value="available">Available in Stock</option>
            <option value="sold">Sold Cars</option>
          </select>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="mt-4 flex items-center justify-between text-xs text-neutral-600 pt-3 border-t border-neutral-100">
        <div>
          Showing <span className="font-bold text-neutral-900">{totalFiltered}</span> of{' '}
          <span className="font-semibold text-neutral-700">{totalAll}</span> cars
        </div>
        {isFiltered && (
          <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
            Filters Active
          </span>
        )}
      </div>
    </div>
  );
};
