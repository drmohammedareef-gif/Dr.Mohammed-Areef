import React, { useState } from 'react';
import { 
  Car as CarIcon, 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  ShieldCheck, 
  SlidersHorizontal,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from '../utils/formatters';
import { ActivePage } from '../types';

export const Navbar: React.FC = () => {
  const { activePage, setActivePage, cars, settings, pendingCount, adminLoggedIn } = useCars();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const availableCount = cars.filter((c) => c.status === 'available').length;

  const publicNavItems: { id: ActivePage; label: string; badge?: number; highlight?: boolean }[] = [
    { id: 'home', label: 'Home' },
    { id: 'cars', label: 'Available Cars', badge: availableCount },
    { id: 'sell', label: 'Sell Your Car', highlight: true },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  // The Admin Dashboard must NOT be visible as a normal public navigation item.
  // Only display to authenticated admin users when signed in.
  const navItems = adminLoggedIn
    ? [
        ...publicNavItems,
        { id: 'admin' as ActivePage, label: 'Admin Dashboard', badge: pendingCount > 0 ? pendingCount : undefined }
      ]
    : publicNavItems;

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/95 backdrop-blur-xl transition-colors">
      {/* Top micro showroom announcement bar */}
      <div className="hidden sm:block border-b border-neutral-900 bg-neutral-950 px-4 py-2 text-xs text-neutral-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <MapPin className="h-3.5 w-3.5 text-red-500" />
              <span>{settings.shortAddress}</span>
            </span>
            <span className="text-neutral-800">•</span>
            <span className="text-neutral-400">{settings.businessHoursWeekdays}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <ShieldCheck className="h-3.5 w-3.5 text-red-500" />
              <span>150-Point Certified Inspection Guarantee</span>
            </span>
            <span className="text-neutral-800">•</span>
            <a
              href={getPhoneCallUrl(settings)}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
            >
              <Phone className="h-3 w-3 text-red-500" />
              <span className="font-semibold text-white">{settings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-lg shadow-red-900/30 group-hover:scale-105 transition-transform border border-red-500/30">
            <CarIcon className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.2]" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 ring-2 ring-neutral-950">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-red-400 transition-colors">
                AM CARS
              </span>
              <span className="rounded bg-red-600/20 border border-red-500/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-400">
                AMBAI
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-neutral-400 font-medium hidden xs:block tracking-wide uppercase">
              Automotive Showroom
            </p>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            const isSell = item.id === 'sell';

            if (isSell) {
              return (
                <button
                  key={item.id}
                  id="nav-sell-your-car-btn"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border shadow-sm ${
                    isActive
                      ? 'bg-red-600 text-white border-red-500 shadow-red-900/30 scale-105'
                      : 'bg-red-600/15 border-red-600/40 text-red-300 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-red-400 group-hover:text-white" />
                    <span>Sell Your Car</span>
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white bg-neutral-900 border border-neutral-800 shadow-inner'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.id === 'admin' && (
                    <SlidersHorizontal className="h-3.5 w-3.5 text-red-400" />
                  )}
                  {item.label}
                  {item.badge !== undefined && (
                    <span className="rounded-full bg-red-600/20 border border-red-500/40 px-2 py-0.2 text-[10px] font-bold text-red-300">
                      {item.badge}
                    </span>
                  )}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-red-600 shadow-sm shadow-red-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center space-x-2.5">
          {/* Direct Phone Dial */}
          <a
            href={getPhoneCallUrl(settings)}
            id="nav-call-btn"
            className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/90 px-3.5 py-2 text-xs font-bold text-neutral-200 hover:border-red-600/40 hover:bg-neutral-800 hover:text-white transition-all shadow-sm"
            title={`Call ${settings.businessName}`}
          >
            <Phone className="h-3.5 w-3.5 text-red-500" />
            <span className="hidden lg:inline">{settings.phone}</span>
            <span className="lg:hidden">{settings.phone}</span>
          </a>

          {/* WhatsApp Direct Chat */}
          <a
            href={getGeneralWhatsAppUrl('', settings)}
            target="_blank"
            rel="noopener noreferrer"
            id="nav-whatsapp-btn"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-950/50 hover:bg-emerald-500 transition-all active:scale-95"
          >
            <MessageCircle className="h-3.5 w-3.5 fill-current" />
            <span>WhatsApp Us</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={getGeneralWhatsAppUrl('', settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm"
            aria-label="WhatsApp enquiry"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-800 bg-neutral-950 px-4 py-4 md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1 pb-3">
            {navItems.map((item) => {
              const isSell = item.id === 'sell';
              const isActive = activePage === item.id;

              if (isSell) {
                return (
                  <button
                    key={item.id}
                    id="mobile-nav-sell-btn"
                    onClick={() => handleNavClick(item.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all border my-1 cursor-pointer ${
                      isActive
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                        : 'bg-red-600/15 border-red-600/40 text-red-300 hover:bg-red-600 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-red-400" />
                      <span>Sell Your Car</span>
                    </span>
                    <span className="text-[10px] uppercase font-extrabold bg-red-500/30 px-2 py-0.5 rounded-full text-red-200">
                      Instant Valuation
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-red-400 border border-neutral-800'
                      : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.id === 'admin' && (
                      <SlidersHorizontal className="h-4 w-4 text-neutral-400" />
                    )}
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      item.id === 'admin' 
                        ? 'bg-red-600 text-white font-bold' 
                        : 'bg-red-600/20 text-red-300 border border-red-500/40'
                    }`}>
                      {item.badge} {item.id === 'admin' ? 'Pending' : 'Cars'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t border-neutral-900 pt-3 space-y-2">
            <a
              href={getPhoneCallUrl(settings)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm font-bold text-neutral-200 hover:bg-neutral-800"
            >
              <Phone className="h-4 w-4 text-red-500" />
              <span>Call: {settings.phone}</span>
            </a>
            <a
              href={getGeneralWhatsAppUrl('', settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-500"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
              <span>WhatsApp: {settings.whatsapp}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
