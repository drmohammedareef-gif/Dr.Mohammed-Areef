import React from 'react';
import { 
  Car as CarIcon, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from '../utils/formatters';
import { ActivePage } from '../types';

export const Footer: React.FC<{ onNavigate: (page: ActivePage) => void }> = ({ onNavigate }) => {
  const { settings } = useCars();

  return (
    <footer className="border-t border-neutral-900 bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-md shadow-red-950/40 border border-red-500/30">
                <CarIcon className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-display text-xl font-black tracking-tight text-white">
                  AM CARS
                </span>
                <span className="ml-2 rounded bg-red-600/20 border border-red-500/40 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-400">
                  AMBAI
                </span>
                <p className="text-[11px] text-neutral-400">{settings.shortAddress} Pre-Owned Showroom</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-neutral-300">
              Your trusted destination for certified pre-owned cars in Ambasamudram, Tirunelveli, and Tenkasi districts. Non-accidental guarantee, 150-point quality checks, and seamless RC transfer.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-red-400 font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>Certified Automotive Showroom</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-4 text-neutral-300">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-red-400 transition-colors cursor-pointer text-neutral-300"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cars')}
                  className="hover:text-red-400 transition-colors cursor-pointer text-neutral-300"
                >
                  Available Cars
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sell')}
                  className="hover:text-red-400 transition-colors text-red-400 font-semibold cursor-pointer"
                >
                  Sell Your Car
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-red-400 transition-colors cursor-pointer text-neutral-300"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-red-400 transition-colors cursor-pointer text-neutral-300"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-4 text-neutral-300">
              Showroom Reach
            </h4>
            <p className="text-xs text-neutral-300 mb-3">
              Serving customers across Southern Tamil Nadu:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="rounded-lg bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-neutral-300">
                Ambasamudram (Ambai)
              </span>
              <span className="rounded-lg bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-neutral-300">
                Tirunelveli (TN-72)
              </span>
              <span className="rounded-lg bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-neutral-300">
                Tenkasi (TN-76)
              </span>
              <span className="rounded-lg bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-neutral-300">
                Cheranmahadevi
              </span>
              <span className="rounded-lg bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-neutral-300">
                Alangulam
              </span>
              <span className="rounded-lg bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-neutral-300">
                Kallidaikurichi
              </span>
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-4 text-neutral-300">
              {settings.businessName}
            </h4>

            <div className="flex items-start gap-2.5 text-xs text-neutral-300">
              <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2.5 text-xs">
                <Phone className="h-4 w-4 text-red-500 shrink-0" />
                <a 
                  href={getPhoneCallUrl(settings)} 
                  className="text-white hover:text-red-400 font-bold tracking-wide transition-colors"
                  title={`Call ${settings.businessName}`}
                >
                  Phone: {settings.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <MessageCircle className="h-4 w-4 text-emerald-400 shrink-0 fill-emerald-400/20" />
                <a
                  href={getGeneralWhatsAppUrl('', settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
                  title={`WhatsApp ${settings.businessName}`}
                >
                  WhatsApp: {settings.whatsapp}
                </a>
              </div>

              {/* Quick action buttons */}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href={getPhoneCallUrl(settings)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-bold text-neutral-200 hover:text-white hover:border-red-600 transition-colors"
                  title={`Call ${settings.businessName} at ${settings.phone}`}
                >
                  <Phone className="h-3 w-3 text-red-500" />
                  <span>Call {settings.phone}</span>
                </a>
                <a
                  href={getGeneralWhatsAppUrl('', settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow"
                  title={`WhatsApp ${settings.businessName} at ${settings.whatsapp}`}
                >
                  <MessageCircle className="h-3 w-3 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-neutral-300 pt-1">
              <Clock className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-neutral-200">{settings.businessHoursWeekdays}</p>
                <p className="text-[11px] text-neutral-400">{settings.businessHoursSunday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
            <span>Certified Pre-Owned Car Showroom in {settings.shortAddress}.</span>
            <span className="text-neutral-800">•</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-neutral-600 hover:text-neutral-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Authorized Portal"
              aria-label="Staff Portal"
            >
              <Lock className="h-2.5 w-2.5" />
              <span>Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
