import React from 'react';
import { 
  Fuel, 
  Gauge, 
  Calendar, 
  MessageCircle, 
  Phone,
  Eye, 
  ShieldCheck, 
  MapPin,
  Sparkles,
  Cog
} from 'lucide-react';
import { Car } from '../types';
import { 
  formatIndianRupees, 
  formatPriceLakh, 
  formatKM, 
  calculateEstimatedEMI, 
  getCarWhatsAppUrl, 
  getPhoneCallUrl 
} from '../utils/formatters';
import { useCars } from '../context/CarContext';

interface CarCardProps {
  car: Car;
  onViewDetails: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onViewDetails }) => {
  const { settings } = useCars();
  const isSold = car.status === 'sold';
  const estimatedEMI = calculateEstimatedEMI(car.price);
  const mainImage = car.images && car.images.length > 0 ? car.images[0] : '';
  const mfgYear = car.manufacturingYear || car.year;
  const regYear = car.registrationYear || car.year;

  return (
    <div
      id={`car-card-${car.id}`}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 ${
        isSold
          ? 'border-neutral-200 bg-neutral-100/70 opacity-80'
          : 'border-neutral-200/90 bg-white hover:border-emerald-500/60 hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      {/* Top Image Area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        {mainImage ? (
          <img
            src={mainImage}
            alt={`${car.year} ${car.brand} ${car.model}`}
            className={`h-full w-full object-cover object-center transition-transform duration-700 ${
              isSold ? 'grayscale' : 'group-hover:scale-105'
            }`}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-400 text-xs">
            No Photo Available
          </div>
        )}

        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {isSold ? (
            <span className="rounded-lg bg-neutral-900/90 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm">
              Sold Out
            </span>
          ) : car.featured ? (
            <span className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm">
              <Sparkles className="h-3 w-3" />
              <span>Showroom Pick</span>
            </span>
          ) : (
            <span className="rounded-lg bg-white/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-neutral-800 shadow-sm border border-neutral-200/80">
              Certified
            </span>
          )}
        </div>

        {/* Year / RTO Badge */}
        <div className="absolute top-3 right-3">
          <span className="rounded-lg bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            {car.registrationState ? car.registrationState.split(' ')[0] : 'TN'}
          </span>
        </div>

        {/* Quick View Details Button on Hover */}
        <button
          onClick={() => onViewDetails(car)}
          className="absolute inset-0 flex items-center justify-center bg-neutral-900/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          aria-label={`View details for ${car.brand} ${car.model}`}
        >
          <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-extrabold text-neutral-900 shadow-md">
            <Eye className="h-3.5 w-3.5 text-emerald-600" />
            <span>Quick Preview</span>
          </span>
        </button>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Brand & Location Row */}
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span className="font-bold uppercase tracking-wider text-emerald-700">{car.brand}</span>
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="h-3 w-3 text-neutral-400" />
              <span>{car.location || settings.shortAddress}</span>
            </span>
          </div>

          {/* Model & Variant */}
          <h3 className="font-display text-lg font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {car.model}
          </h3>
          <p className="text-xs text-neutral-500 line-clamp-1 mb-3">
            {car.variant || `${car.fuelType} • ${car.transmission}`}
          </p>

          {/* Specifications Pills */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-50 p-2.5 text-xs text-neutral-700 border border-neutral-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>{car.year} {mfgYear !== regYear ? `(Reg ${regYear})` : ''}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>{formatKM(car.kilometers)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cog className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>{car.transmission}</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA Section */}
        <div className="mt-4 pt-3 border-t border-neutral-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">Showroom Price</span>
              <p className="font-display text-xl font-black text-neutral-900">
                {formatPriceLakh(car.price)}
              </p>
            </div>
            {estimatedEMI > 0 && !isSold && (
              <div className="text-right">
                <span className="text-[10px] text-neutral-500">Est. EMI</span>
                <p className="text-xs font-bold text-emerald-700">₹{estimatedEMI.toLocaleString('en-IN')}/mo</p>
              </div>
            )}
          </div>

          {/* Primary View Details Button */}
          <button
            onClick={() => onViewDetails(car)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-emerald-600 text-white py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs mb-2"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>VIEW DETAILS</span>
          </button>

          {/* Action hotlines: Call & WhatsApp */}
          {!isSold && (
            <div className="grid grid-cols-2 gap-2">
              <a
                href={getPhoneCallUrl(settings)}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 py-2 text-[11px] font-bold text-neutral-800 hover:border-neutral-300 hover:bg-neutral-100 transition-colors"
                title={`Call about ${car.brand} ${car.model}`}
              >
                <Phone className="h-3 w-3 text-emerald-600" />
                <span>Call</span>
              </a>

              <a
                href={getCarWhatsAppUrl(car, settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                title={`WhatsApp enquiry for ${car.brand} ${car.model}`}
              >
                <MessageCircle className="h-3 w-3 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
