import React from 'react';
import { 
  Calendar, 
  Gauge, 
  Fuel, 
  Cog, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  Sparkles,
  Award,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { 
  formatPriceLakh, 
  formatKM, 
  getCarWhatsAppUrl, 
  getPhoneCallUrl 
} from '../utils/formatters';

export const FeaturedCarSection: React.FC = () => {
  const { cars, setSelectedCar, settings } = useCars();

  // Find a featured available car or fallback to first available
  const featuredCar = 
    cars.find((c) => c.featured && c.status === 'available') ||
    cars.find((c) => c.status === 'available') ||
    cars[0];

  if (!featuredCar) return null;

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>SPOTLIGHT SHOWROOM VEHICLE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight uppercase">
            Featured Car of the Week
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600">
            Handpicked by our inspection master for pristine mechanical health, single-owner history, and unmatched showroom condition.
          </p>
        </div>

        {/* Feature Showcase Card */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-slate-50/60 p-6 sm:p-8 lg:p-10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Large Car Visual */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-200/80 group shadow-md">
                <img
                  src={featuredCar.images[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'}
                  alt={`${featuredCar.brand} ${featuredCar.model}`}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="rounded-xl bg-emerald-600 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-md">
                    Featured Choice
                  </span>
                  <span className="rounded-xl bg-white/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-neutral-800 border border-neutral-200 shadow-sm">
                    {featuredCar.registrationState || 'TN Registered'}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold text-emerald-300">Certified Inspection</p>
                    <h3 className="font-display text-xl sm:text-2xl font-black">
                      {featuredCar.year} {featuredCar.brand} {featuredCar.model}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedCar(featuredCar)}
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-3.5 py-2 text-xs font-bold text-neutral-900 shadow-md hover:bg-white"
                  >
                    <Eye className="h-3.5 w-3.5 text-emerald-600" />
                    <span>View Gallery ({featuredCar.images.length} Photos)</span>
                  </button>
                </div>
              </div>

              {/* Verified Checklist Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs text-neutral-700">
                <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-2.5 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">100% Genuine KM</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-2.5 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Non-Accidental</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-2.5 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Clean RTO Title</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-2.5 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Spot Delivery</span>
                </div>
              </div>
            </div>

            {/* Right: Specifications & Pricing Details */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  <span>{featuredCar.brand}</span>
                  <span>•</span>
                  <span>{featuredCar.bodyType}</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-neutral-900 leading-snug">
                  {featuredCar.model}
                </h3>
                <p className="text-sm font-semibold text-neutral-600 mt-0.5">
                  {featuredCar.variant}
                </p>
              </div>

              {/* Price Banner */}
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4">
                <span className="text-xs uppercase tracking-wider font-bold text-neutral-600">
                  Showroom Price (All Inclusive)
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display text-3xl sm:text-4xl font-black text-neutral-900">
                    {formatPriceLakh(featuredCar.price)}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">
                    • Best Price Guaranteed
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Ready for spot delivery in Ambasamudram • RC transfer handled by AM Cars
                </p>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
                  <Calendar className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 font-semibold">Model Year</span>
                    <p className="text-xs font-bold text-neutral-900">{featuredCar.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
                  <Gauge className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 font-semibold">Kilometers</span>
                    <p className="text-xs font-bold text-neutral-900">{formatKM(featuredCar.kilometers)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
                  <Fuel className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 font-semibold">Fuel Type</span>
                    <p className="text-xs font-bold text-neutral-900">{featuredCar.fuelType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
                  <Cog className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 font-semibold">Transmission</span>
                    <p className="text-xs font-bold text-neutral-900">{featuredCar.transmission}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 font-semibold">Ownership</span>
                    <p className="text-xs font-bold text-neutral-900">{featuredCar.owners || '1st Owner'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
                  <MapPin className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 font-semibold">Location</span>
                    <p className="text-xs font-bold text-neutral-900">{featuredCar.location || settings.shortAddress}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  id="featured-car-view-details-btn"
                  onClick={() => setSelectedCar(featuredCar)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  <span>VIEW DETAILS</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={getPhoneCallUrl(settings)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition-all shadow-xs"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Call: {settings.phone}</span>
                  </a>

                  <a
                    href={getCarWhatsAppUrl(featuredCar, settings)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-xs"
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
