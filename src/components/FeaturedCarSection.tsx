import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Gauge, 
  Fuel, 
  Cog, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  MessageCircle 
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { formatPriceLakh, formatKM, getCarWhatsAppUrl, getPhoneCallUrl } from '../utils/formatters';

export const FeaturedCarSection: React.FC = () => {
  const { cars, setSelectedCar, settings } = useCars();

  // Pick top available car (e.g. Creta or Thar or highest price available)
  const availableCars = cars.filter((c) => c.status === 'available');
  const featuredCar = availableCars.find((c) => c.price >= 1000000) || availableCars[0];

  if (!featuredCar) return null;

  return (
    <section className="relative overflow-hidden bg-neutral-950 py-16 sm:py-24 border-b border-neutral-900">
      {/* Background ambient red glow */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 h-96 w-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-600/10 px-3.5 py-1 text-xs font-bold text-red-400 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-red-500" />
            <span>SPOTLIGHT SHOWROOM VEHICLE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
            FEATURED CAR OF THE WEEK
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            Handpicked by our inspection master for pristine mechanical health, single-owner history, and unmatched condition.
          </p>
        </div>

        {/* Feature Showcase Card */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 lg:p-10 backdrop-blur-xl shadow-2xl">
          {/* Subtle top red glow line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Large Car Visual */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800 group shadow-inner">
                <img
                  src={featuredCar.images[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'}
                  alt={`${featuredCar.brand} ${featuredCar.model}`}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />

                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                    Featured Choice
                  </span>
                  <span className="rounded-lg bg-neutral-900/80 backdrop-blur-md px-3 py-1 text-xs font-semibold text-neutral-200 border border-neutral-700">
                    {featuredCar.registrationState || 'TN Registered'}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="rounded-md bg-emerald-600/90 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
                    150-Point Verified
                  </span>
                  {featuredCar.images.length > 1 && (
                    <span className="text-xs text-neutral-300 bg-neutral-950/70 px-2.5 py-1 rounded backdrop-blur">
                      {featuredCar.images.length} High-Res Photos
                    </span>
                  )}
                </div>
              </div>

              {/* Secondary photo thumbnails if available */}
              {featuredCar.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {featuredCar.images.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCar(featuredCar)}
                      className="relative aspect-[16/10] overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 hover:border-red-500 transition-all cursor-pointer"
                    >
                      <img
                        src={img}
                        alt={`thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Car Details & Specs */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-red-500">
                  {featuredCar.brand}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
                  {featuredCar.model}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-medium mt-0.5">
                  {featuredCar.variant}
                </p>
              </div>

              {/* Price Banner */}
              <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-4 sm:p-5">
                <span className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider">
                  Showroom Price (All Inclusive)
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display text-3xl sm:text-4xl font-black text-white">
                    {formatPriceLakh(featuredCar.price)}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">
                    • Best Price Guaranteed
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Ready for spot delivery in Ambasamudram • RC transfer handled by AM Cars
                </p>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                  <Calendar className="h-5 w-5 text-red-500 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-medium">Model Year</span>
                    <p className="text-xs font-bold text-white">{featuredCar.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                  <Gauge className="h-5 w-5 text-red-500 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-medium">Kilometers</span>
                    <p className="text-xs font-bold text-white">{formatKM(featuredCar.kilometers)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                  <Fuel className="h-5 w-5 text-red-500 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-medium">Fuel Type</span>
                    <p className="text-xs font-bold text-white">{featuredCar.fuelType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                  <Cog className="h-5 w-5 text-red-500 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-medium">Transmission</span>
                    <p className="text-xs font-bold text-white">{featuredCar.transmission}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                  <ShieldCheck className="h-5 w-5 text-red-500 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-medium">Ownership</span>
                    <p className="text-xs font-bold text-white">{featuredCar.owners || '1st Owner'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                  <MapPin className="h-5 w-5 text-red-500 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-medium">Location</span>
                    <p className="text-xs font-bold text-white">{featuredCar.location || settings.shortAddress}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  id="featured-car-view-details-btn"
                  onClick={() => setSelectedCar(featuredCar)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition-all active:scale-95 cursor-pointer"
                >
                  <span>VIEW FULL DETAILS & INSPECTION</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={getPhoneCallUrl(settings)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-xs font-bold text-white hover:border-neutral-600 hover:bg-neutral-800 transition-all"
                  >
                    <Phone className="h-3.5 w-3.5 text-red-400" />
                    <span>Call: {settings.phone}</span>
                  </a>

                  <a
                    href={getCarWhatsAppUrl(featuredCar, settings)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-sm"
                  >
                    <MessageCircle className="h-3.5 w-3.5 fill-current" />
                    <span>WhatsApp Us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
