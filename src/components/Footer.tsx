import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Lock, 
  Clock, 
  Mail,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from '../utils/formatters';
import { ActivePage } from '../types';
import { AmCarsLogo } from './AmCarsLogo';

export const Footer: React.FC<{ onNavigate: (page: ActivePage) => void }> = ({ onNavigate }) => {
  const { settings } = useCars();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-900">
      {/* Upper Footer Columns */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Drive Your Dream */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center text-left focus:outline-none group cursor-pointer"
              aria-label="AM CARS AMBAI Home"
            >
              <AmCarsLogo size="lg" lightMode={false} />
            </button>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              Your trusted pre-owned automotive destination in Ambasamudram. Certified non-accidental vehicles, genuine odometer audits, and verified legal ownership transfers.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-neutral-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>150-Point Inspection</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-neutral-300">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                <span>Spot Delivery</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <ChevronRight className="h-3 w-3 text-neutral-600" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cars')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <ChevronRight className="h-3 w-3 text-neutral-600" />
                  <span>Available Cars</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sell')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer text-emerald-400 font-semibold"
                >
                  <ChevronRight className="h-3 w-3 text-emerald-500" />
                  <span>Sell Your Car</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <ChevronRight className="h-3 w-3 text-neutral-600" />
                  <span>About AM Cars</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <ChevronRight className="h-3 w-3 text-neutral-600" />
                  <span>Contact Showroom</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-400">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Certified Pre-Owned Car Sales</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Confidential Car Selling Brokerage</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Low Interest Bank Car Loans & EMI</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>RTO Name Transfer & Documentation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Comprehensive Insurance Renewal</span>
              </li>
            </ul>
          </div>

          {/* Contact & Social links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Contact & Location
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-neutral-300">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <a href={getPhoneCallUrl(settings)} className="text-white hover:text-emerald-400 font-bold">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <a
                  href={getGeneralWhatsAppUrl('', settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-bold"
                >
                  WhatsApp: {settings.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-neutral-400">Mon - Sat: {settings.businessHoursWeekdays}</span>
              </div>
            </div>

            {/* Social Links & Directions */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 hover:text-white hover:border-emerald-600 transition-colors"
              >
                <span>Google Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={getGeneralWhatsAppUrl('', settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="h-3 w-3 fill-current" />
                <span>Chat</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Copyright and Discreet Admin Login */}
      <div className="border-t border-neutral-900 bg-black/50 px-4 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-neutral-500 sm:flex-row">
          <p>© {currentYear} {settings.businessName} Ambai. All rights reserved.</p>

          <div className="flex items-center space-x-6 text-[11px]">
            <span>Ambasamudram • Tirunelveli • Tenkasi</span>
            <span className="text-neutral-800">•</span>
            {/* Discreet Admin Login */}
            <button
              onClick={() => onNavigate('admin')}
              className="text-neutral-600 hover:text-neutral-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Admin Login"
              aria-label="Admin Login"
            >
              <Lock className="h-2.5 w-2.5" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
