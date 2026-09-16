import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  ShieldCheck, 
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from '../utils/formatters';
import { ActivePage } from '../types';
import { AmCarsLogo } from './AmCarsLogo';

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
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md transition-all shadow-xs">
      {/* Top showroom micro announcement bar */}
      <div className="hidden sm:block border-b border-neutral-100 bg-neutral-50/90 px-4 py-2 text-xs text-neutral-600">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="flex items-center gap-1.5 font-medium text-neutral-700">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>{settings.shortAddress}, Tamil Nadu</span>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-500">{settings.businessHoursWeekdays}</span>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="flex items-center gap-1.5 text-neutral-600">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>150-Point Certified Inspection Guarantee</span>
            </span>
            <span className="text-neutral-300">•</span>
            <a
              href={getPhoneCallUrl(settings)}
              className="flex items-center gap-1.5 font-semibold text-neutral-800 hover:text-emerald-700 transition-colors"
            >
              <Phone className="h-3 w-3 text-emerald-600" />
              <span>{settings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center text-left focus:outline-none group cursor-pointer"
          aria-label="AM CARS AMBAI Home"
        >
          <AmCarsLogo size="md" lightMode={true} />
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
                  className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30 scale-105'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500 group-hover:text-white" />
                    <span>Sell Your Car</span>
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-neutral-950 bg-neutral-100 font-bold'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.id === 'admin' && (
                    <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
                  )}
                  {item.label}
                  {item.badge !== undefined && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {item.badge}
                    </span>
                  )}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 left-3.5 right-3.5 h-[2px] rounded-full bg-emerald-600" />
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
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-xs"
            title={`Call ${settings.businessName}`}
          >
            <Phone className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden lg:inline">{settings.phone}</span>
            <span className="lg:hidden">{settings.phone}</span>
          </a>

          {/* WhatsApp Direct Chat */}
          <a
            href={getGeneralWhatsAppUrl('', settings)}
            target="_blank"
            rel="noopener noreferrer"
            id="nav-whatsapp-btn"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700 transition-all active:scale-95"
          >
            <MessageCircle className="h-3.5 w-3.5 fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Mobile menu and WhatsApp button */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={getGeneralWhatsAppUrl('', settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs"
            aria-label="WhatsApp enquiry"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:text-neutral-950 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-neutral-200/80 bg-white px-4 py-5 shadow-lg md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              const isSell = item.id === 'sell';

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors text-left ${
                    isSell
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : isActive
                      ? 'bg-neutral-100 text-neutral-950 font-bold border-l-4 border-emerald-600'
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.id === 'sell' && <Sparkles className="h-4 w-4 text-emerald-600" />}
                    {item.id === 'admin' && <SlidersHorizontal className="h-4 w-4 text-emerald-600" />}
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Direct Action Hotlines */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 pt-4 border-t border-neutral-100">
            <a
              href={getPhoneCallUrl(settings)}
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100"
            >
              <Phone className="h-3.5 w-3.5 text-emerald-600" />
              <span>Call Now</span>
            </a>
            <a
              href={getGeneralWhatsAppUrl('', settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20"
            >
              <MessageCircle className="h-3.5 w-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
