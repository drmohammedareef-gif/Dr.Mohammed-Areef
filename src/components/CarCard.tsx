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
  Sparkles
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
          ? 'border-neutral-800/60 bg-neutral-950/60 opacity-80'
          : 'border-neutral-800/90 bg-neutral-900/80 backdrop-blur-md hover:border-red-600/50 hover:bg-neutral-900 hover:shadow-2xl hover:shadow-red-950/30'
      }`}
    >
      {/* Top Image Area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
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
          <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-neutral-500 text-xs">
            No Photo Available
          </div>
        )}

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80" />

        {/* Status and Ownership Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          {isSold ? (
            <span className="rounded-lg bg-neutral-800 border border-neutral-700 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-300 shadow">
              SOLD OUT
            </span>
          ) : (
            <>
              <span className="rounded-lg bg-red-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                AVAILABLE
              </span>
              {car.featured && (
                <span className="rounded-lg bg-neutral-900/90 backdrop-blur border border-red-500/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
                  ★ Featured
                </span>
              )}
            </>
          )}
        </div>

        {/* RTO District Badge */}
        <div className="absolute top-3 right-3">
          <span className="rounded-lg bg-neutral-950/80 backdrop-blur border border-neutral-700 px-2 py-1 text-[11px] font-bold text-neutral-200">
            {car.rtoCode ? car.rtoCode.split('-').slice(0, 2).join('-') : car.registrationState.split(' ')[0]}
          </span>
        </div>

        {/* Location & Inspection Indicator */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-neutral-300 font-medium">
          <span className="flex items-center gap-1 rounded-md bg-black/70 backdrop-blur px-2 py-0.5 text-neutral-300">
            <MapPin className="h-3 w-3 text-red-500" />
            <span className="truncate max-w-[130px]">{car.location || 'Ambasamudram, TN'}</span>
          </span>
          <span className="flex items-center gap-1 text-red-400 font-semibold bg-black/70 backdrop-blur px-2 py-0.5 rounded-md">
            <ShieldCheck className="h-3 w-3" />
            150-Pt Checked
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Car Name & Variant */}
        <div className="mb-3">
          <p className="text-[11px] font-black uppercase tracking-widest text-red-500">
            {car.brand}
          </p>
          <h3 className="font-display text-lg sm:text-xl font-black text-white group-hover:text-red-400 transition-colors line-clamp-1">
            {car.model}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-1">{car.variant}</p>
        </div>

        {/* Key Specs Pills Grid */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-950/80 p-2.5 border border-neutral-800/80 mb-3 text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-red-500 shrink-0" />
            <span className="truncate">
              Year: <strong className="text-white">{mfgYear}</strong>
              {regYear !== mfgYear && <span className="text-neutral-400 text-[10px]"> (Reg {regYear})</span>}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Gauge className="h-3.5 w-3.5 text-red-500 shrink-0" />
            <span className="truncate">{formatKM(car.kilometers)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Fuel className="h-3.5 w-3.5 text-red-500 shrink-0" />
            <span>{car.fuelType}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border border-red-500 text-[8px] text-red-400 text-center leading-3">T</span>
            <span>{car.transmission}</span>
          </div>
        </div>

        {/* Price & EMI Section */}
        <div className="mb-4 flex items-baseline justify-between border-t border-neutral-800/60 pt-3">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              Showroom Price
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl sm:text-2xl font-black text-white">
                {formatPriceLakh(car.price)}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              {formatIndianRupees(car.price)}
            </p>
          </div>

          {!isSold && (
            <div className="text-right">
              <p className="text-[10px] text-neutral-400 font-medium">Est. EMI</p>
              <p className="text-xs font-bold text-emerald-400">
                ₹{estimatedEMI.toLocaleString('en-IN')}/mo*
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="space-y-2 mt-auto">
          {/* VIEW DETAILS Full Width Button */}
          <button
            onClick={() => onViewDetails(car)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 border border-neutral-700/80 py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-white hover:border-red-600 hover:bg-neutral-800 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <Eye className="h-3.5 w-3.5 text-red-500" />
            <span>VIEW DETAILS</span>
          </button>

          {/* Contact Row: Call Now + WhatsApp Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {isSold ? (
              <>
                <button
                  disabled
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 border border-neutral-800 py-2 px-2 text-xs font-semibold text-neutral-600 cursor-not-allowed"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call</span>
                </button>
                <button
                  disabled
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 border border-neutral-800 py-2 px-2 text-xs font-semibold text-neutral-600 cursor-not-allowed"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Sold Out</span>
                </button>
              </>
            ) : (
              <>
                {/* Call Now button - calls AM Cars Ambai official business number */}
                <a
                  href={getPhoneCallUrl(settings)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-neutral-700 hover:bg-neutral-800 text-neutral-200 py-2 px-2 text-xs font-bold transition-all active:scale-95 text-center"
                  title={`Call AM Cars Ambai at ${settings.phone}`}
                >
                  <Phone className="h-3.5 w-3.5 text-red-500" />
                  <span>Call Now</span>
                </a>

                {/* WhatsApp button - opens WhatsApp to AM Cars Ambai official business number */}
                <a
                  href={getCarWhatsAppUrl(car, settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-2 text-xs font-bold shadow-md shadow-emerald-950/40 transition-all active:scale-95 text-center"
                  title={`Enquire on WhatsApp with ${settings.businessName}`}
                >
                  <MessageCircle className="h-3.5 w-3.5 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
