import React, { useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  Award, 
  FileCheck, 
  Sparkles,
  Phone,
  MessageCircle,
  CheckCircle2
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
    <section className="relative overflow-hidden bg-neutral-950 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-neutral-900">
      {/* Background ambient red glow and subtle showroom light beams */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-1/4 h-[500px] w-[500px] rounded-full bg-red-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -left-20 h-96 w-96 rounded-full bg-neutral-900/80 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Showroom badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-red-600/40 bg-neutral-900/90 px-3.5 py-1.5 text-xs font-bold text-red-400 shadow-sm backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>{settings.shortAddress} • PRE-OWNED AUTOMOTIVE SHOWROOM</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1.05]">
                FIND YOUR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-600">
                  NEXT CAR
                </span>
              </h1>
              {/* Subheading */}
              <p className="font-display text-lg sm:text-xl font-bold text-neutral-200 tracking-wide">
                Quality Pre-Owned Cars. Trusted Service. Better Deals.
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
              Explore Ambasamudram's premier collection of certified second-hand vehicles. Every car undergoes a stringent 150-point inspection, complete legal documentation audit, and guaranteed non-accidental verification.
            </p>

            {/* Trust checkmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs sm:text-sm text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0" />
                <span>150-Point Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0" />
                <span>Verified RC Transfer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0" />
                <span>Spot Delivery & EMI</span>
              </div>
            </div>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary Button: EXPLORE CARS */}
              <button
                onClick={handleExploreCars}
                id="hero-explore-cars-btn"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-red-600 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-red-600/30 hover:bg-red-500 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <span>EXPLORE CARS</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>

              {/* Secondary Button: SELL YOUR CAR */}
              <button
                onClick={handleSellYourCar}
                id="hero-sell-your-car-btn"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-neutral-700 bg-neutral-900/90 px-7 py-4 text-sm font-extrabold text-white hover:border-red-600 hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer uppercase tracking-wider backdrop-blur-md"
              >
                <Sparkles className="h-4 w-4 text-red-500" />
                <span>SELL YOUR CAR</span>
              </button>
            </div>

            {/* Quick Contact & Inventory Counter */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-white font-bold">{availableCars.length} Verified Cars</span>
                <span>Ready in Showroom</span>
              </div>
              <div className="hidden sm:block text-neutral-700">|</div>
              <a
                href={getPhoneCallUrl(settings)}
                className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-red-500" />
                <span>Call Now: <strong className="text-white">{settings.phone}</strong></span>
              </a>
              <a
                href={getGeneralWhatsAppUrl('', settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5 fill-current" />
                <span>WhatsApp: {settings.whatsapp}</span>
              </a>
            </div>
          </div>

          {/* Right Column: High-Impact Automotive Visual + Quick Filter Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative group overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-2.5 shadow-2xl">
              {/* Car imagery with showroom reflection */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-900">
                <img
                  src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
                  alt={`${settings.businessName} Luxury Showroom Car`}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />

                {/* Showroom Badge */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-xl bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 border border-neutral-800 text-xs font-bold text-white shadow-lg">
                  <Award className="h-4 w-4 text-red-500" />
                  <span>AM Cars Ambai Showroom</span>
                </div>

                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs text-white">
                  <div>
                    <p className="font-extrabold text-sm drop-shadow">{settings.businessName}</p>
                    <p className="text-neutral-300 text-[11px] drop-shadow">Ambasamudram • Tirunelveli Dist</p>
                  </div>
                  <span className="rounded-lg bg-red-600 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                    Spot Delivery
                  </span>
                </div>
              </div>

              {/* Quick Search Widget */}
              <form
                onSubmit={handleQuickSearch}
                className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-neutral-950/80 rounded-2xl border border-neutral-800 backdrop-blur-md"
              >
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 px-1">
                    Select Brand
                  </label>
                  <select
                    value={quickBrand}
                    onChange={(e) => setQuickBrand(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-medium text-white focus:border-red-500 focus:outline-none"
                  >
                    {POPULAR_BRANDS.map((b) => (
                      <option key={b} value={b} className="bg-neutral-900 text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 px-1">
                    Budget
                  </label>
                  <select
                    value={quickBudget}
                    onChange={(e) => setQuickBudget(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-medium text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="all">Any Budget</option>
                    <option value="under3">Under ₹3 Lakh</option>
                    <option value="3to6">₹3 Lakh - ₹6 Lakh</option>
                    <option value="6to10">₹6 Lakh - ₹10 Lakh</option>
                    <option value="above10">Above ₹10 Lakh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 px-1">
                    Body Type
                  </label>
                  <select
                    value={quickBody}
                    onChange={(e) => setQuickBody(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-medium text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="MUV">MUV (7-Seater)</option>
                  </select>
                </div>

                <div className="sm:col-span-3 pt-1">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-red-500 transition-colors shadow-md shadow-red-950/40 cursor-pointer"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>Search Certified Inventory</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
