import React, { useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Phone,
  MessageCircle,
  SlidersHorizontal,
  Car as CarIcon
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from '../utils/formatters';
import { POPULAR_BRANDS } from '../data/sampleCars';

export const Hero: React.FC = () => {
  const { setActivePage, setFilters, cars, settings } = useCars();
  const [quickBrand, setQuickBrand] = useState('All Brands');
  const [quickBudget, setQuickBudget] = useState('all');
  const [quickBody, setQuickBody] = useState('all');

  const availableCars = cars.filter((c) => c.status === 'available');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      brand: quickBrand,
      priceRange: quickBudget,
      bodyType: quickBody,
    }));
    setActivePage('cars');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreCars = () => {
    setActivePage('cars');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSellYourCar = () => {
    setActivePage('sell');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-neutral-100/60 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-neutral-200/80">
      {/* Subtle ambient light gradient background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-1/2 -left-20 h-96 w-96 rounded-full bg-slate-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Showroom badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-bold text-emerald-800 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{settings.shortAddress} • CERTIFIED AUTOMOTIVE MARKETPLACE</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 leading-[1.08]">
                Find Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700">
                  Next Car
                </span>
              </h1>
              {/* Subheading */}
              <p className="font-display text-lg sm:text-xl font-bold text-neutral-700 tracking-wide">
                Quality Pre-Owned Cars. Trusted Service. Better Deals.
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed">
              Explore Ambasamudram's premier pre-owned automotive showroom. Every vehicle passes our rigorous 150-point quality inspection, clear title audit, and guaranteed verified ownership transfer.
            </p>

            {/* Trust checkmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs sm:text-sm text-neutral-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>150-Point Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Verified RC Transfer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Spot Delivery & Low EMI</span>
              </div>
            </div>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary Button: Explore Cars */}
              <button
                onClick={handleExploreCars}
                id="hero-explore-cars-btn"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <span>EXPLORE CARS</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>

              {/* Secondary Button: Sell Your Car */}
              <button
                onClick={handleSellYourCar}
                id="hero-sell-your-car-btn"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-neutral-300 bg-white px-7 py-4 text-sm font-bold text-neutral-800 hover:border-emerald-600 hover:text-emerald-700 hover:bg-neutral-50 transition-all active:scale-95 cursor-pointer uppercase tracking-wider shadow-xs"
              >
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>SELL YOUR CAR</span>
              </button>
            </div>

            {/* Quick Contact & Inventory Counter */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span><strong className="text-neutral-900 font-bold">{availableCars.length} Verified Cars</strong> in Stock Today</span>
              </div>
              <span className="text-neutral-300 hidden sm:inline">•</span>
              <a
                href={getPhoneCallUrl(settings)}
                className="flex items-center gap-1.5 font-semibold text-neutral-800 hover:text-emerald-600 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                <span>Hotline: {settings.phone}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Car Visual & Clean Search Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual Hero Car Presentation */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-3 shadow-xl">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100">
                  <img
                    src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
                    alt="AM Cars Ambai Showroom Vehicle"
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="rounded-xl bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                      100% Certified
                    </span>
                    <span className="rounded-xl bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-neutral-800 shadow-sm border border-neutral-200">
                      Non-Accidental
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div>
                      <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Showroom Spotlight</p>
                      <h4 className="font-display text-base font-bold">Hyundai Creta 1.5 SX Executive</h4>
                    </div>
                    <span className="rounded-lg bg-black/50 backdrop-blur-md px-2.5 py-1 text-xs font-bold">
                      TN-76 Registered
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Find Filter Card */}
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                  <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
                  <span>Quick Vehicle Finder</span>
                </div>
                <span className="text-xs text-neutral-500 font-medium">Instant Filter</span>
              </div>

              <form onSubmit={handleQuickSearch} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Brand select */}
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Make</label>
                    <select
                      value={quickBrand}
                      onChange={(e) => setQuickBrand(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
                    >
                      {POPULAR_BRANDS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Budget select */}
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Budget</label>
                    <select
                      value={quickBudget}
                      onChange={(e) => setQuickBudget(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
                    >
                      <option value="all">Any Budget</option>
                      <option value="under5">Under ₹5 Lakh</option>
                      <option value="5to10">₹5 - ₹10 Lakh</option>
                      <option value="10to15">₹10 - ₹15 Lakh</option>
                      <option value="above15">Above ₹15 Lakh</option>
                    </select>
                  </div>

                  {/* Body type */}
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Body Type</label>
                    <select
                      value={quickBody}
                      onChange={(e) => setQuickBody(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
                    >
                      <option value="all">All Types</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="MUV">MUV</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  id="hero-quick-search-btn"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-emerald-600 text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs active:scale-98"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Search Matching Cars</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
