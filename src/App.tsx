import React, { useMemo, useEffect } from 'react';
import { 
  MessageCircle, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  Car as CarIcon, 
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CarProvider, useCars } from './context/CarContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CarCard } from './components/CarCard';
import { CarFilters } from './components/CarFilters';
import { CarDetailsModal } from './components/CarDetailsModal';
import { FeaturedCarSection } from './components/FeaturedCarSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { AdminPanel } from './components/AdminPanel';
import { SellCarSection } from './components/SellCarSection';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { 
  getGeneralWhatsAppUrl, 
  getPhoneCallUrl 
} from './utils/formatters';
import { Car } from './types';

const MainContent: React.FC = () => {
  const { 
    cars, 
    selectedCar, 
    setSelectedCar, 
    activePage, 
    setActivePage, 
    filters, 
    setFilters, 
    resetFilters,
    toastMessage,
    settings 
  } = useCars();

  // Support direct hidden routes like #/admin, #admin, #/cars, #/sell, etc.
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase().replace(/^#[/]?/, '');
      if (['home', 'cars', 'sell', 'about', 'contact', 'admin'].includes(hash)) {
        setActivePage(hash as any);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setActivePage]);

  // Keep hash synced when activePage changes
  useEffect(() => {
    const currentHash = window.location.hash.toLowerCase().replace(/^#[/]?/, '');
    if (currentHash !== activePage) {
      window.history.replaceState(null, '', `#/${activePage}`);
    }
  }, [activePage]);

  // Featured cars for Home page (available first, or marked featured)
  const featuredCars = useMemo(() => {
    const featured = cars.filter((c) => c.featured && c.status === 'available');
    if (featured.length >= 3) return featured.slice(0, 4);
    const available = cars.filter((c) => c.status === 'available');
    return available.slice(0, 4);
  }, [cars]);

  // Filtered cars for "Available Cars" page
  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        // Search query
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const match =
            car.brand.toLowerCase().includes(q) ||
            car.model.toLowerCase().includes(q) ||
            car.variant.toLowerCase().includes(q) ||
            (car.location && car.location.toLowerCase().includes(q)) ||
            (car.registrationState && car.registrationState.toLowerCase().includes(q)) ||
            car.fuelType.toLowerCase().includes(q) ||
            (car.rtoCode && car.rtoCode.toLowerCase().includes(q));
          if (!match) return false;
        }

        // Brand
        if (filters.brand !== 'All Brands' && car.brand !== filters.brand) {
          return false;
        }

        // Model
        if (filters.model && filters.model !== 'All Models') {
          if (car.model.toLowerCase() !== filters.model.toLowerCase()) return false;
        }

        // Price range
        if (filters.priceRange !== 'all') {
          if (filters.priceRange === 'under3' && car.price >= 300000) return false;
          if (filters.priceRange === '3to6' && (car.price < 300000 || car.price > 600000)) return false;
          if (filters.priceRange === '6to10' && (car.price < 600000 || car.price > 1000000)) return false;
          if (filters.priceRange === 'above10' && car.price <= 1000000) return false;
        }

        // Year
        if (filters.year !== 'all') {
          const carYr = car.manufacturingYear || car.year;
          if (filters.year === '2022+' && carYr < 2022) return false;
          if (filters.year === '2020-2021' && (carYr < 2020 || carYr > 2021)) return false;
          if (filters.year === '2018-2019' && (carYr < 2018 || carYr > 2019)) return false;
          if (filters.year === 'older' && carYr >= 2018) return false;
        }

        // Fuel Type
        if (filters.fuelType !== 'all' && car.fuelType !== filters.fuelType) {
          return false;
        }

        // Transmission
        if (filters.transmission !== 'all' && car.transmission !== filters.transmission) {
          return false;
        }

        // Body Type
        if (filters.bodyType !== 'all' && car.bodyType !== filters.bodyType) {
          return false;
        }

        // Location
        if (filters.location && filters.location !== 'all') {
          if (!car.location || !car.location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
          }
        }

        // Status
        if (filters.status !== 'all' && car.status !== filters.status) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'year-desc') return b.year - a.year;
        if (filters.sortBy === 'km-asc') return a.kilometers - b.kilometers;
        // Default featured
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [cars, filters]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-red-600 selection:text-white">
      {/* Top sticky Navigation */}
      <Navbar />

      {/* Main Content Router based on activePage */}
      <main className="flex-1">
        {activePage === 'home' && (
          <div>
            {/* Hero Section */}
            <Hero />

            {/* Featured Car of the Week Spotlight */}
            <FeaturedCarSection />

            {/* Featured Cars Section */}
            <section className="py-16 sm:py-20 bg-neutral-950 border-b border-neutral-900">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-red-600/30 bg-red-600/10 px-3 py-1 text-xs font-semibold text-red-400 mb-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Handpicked Showroom Picks</span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      Featured Pre-Owned Cars
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-neutral-300">
                      Our most sought-after cars currently available at AM Cars Ambai showroom.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActivePage('cars');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-red-500 hover:text-red-400 transition-colors group cursor-pointer"
                  >
                    <span>View All {cars.length} Vehicles</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Featured Cars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredCars.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      onViewDetails={(c) => setSelectedCar(c)}
                    />
                  ))}
                </div>

                {/* Sell Your Car Broker Marketplace Banner */}
                <div className="mt-12 rounded-3xl border border-red-600/30 bg-gradient-to-r from-neutral-900 via-red-950/20 to-neutral-900 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-2 text-center md:text-left">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/15 border border-red-600/30 px-3 py-1 text-xs font-bold text-red-400">
                      <span>Confidential Broker Service</span>
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                      Want to Sell Your Car in Ambasamudram?
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
                      List your car through AM Cars Ambai. We negotiate with verified buyers and handle all RTO documentation. Your personal phone number is <strong className="text-white">100% confidential</strong> and never shared with the public.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActivePage('sell');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-red-600 hover:bg-red-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/50 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Submit Vehicle for Broker Review</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Why Choose Us Section */}
            <WhyChooseUs onNavigateToCars={() => setActivePage('cars')} />

            {/* Customer Testimonials */}
            <Testimonials />

            {/* Quick Contact & Directions Preview */}
            <ContactSection />
          </div>
        )}

        {activePage === 'cars' && (
          <div className="py-10 sm:py-16 bg-neutral-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
              {/* Header */}
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-600/10 px-3.5 py-1 text-xs font-semibold text-red-400 mb-3">
                  <CarIcon className="h-3.5 w-3.5" />
                  <span>Verified Ambasamudram Inventory</span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Available Pre-Owned Cars
                </h1>
                <p className="mt-2 text-sm text-neutral-300">
                  Explore certified used cars with 100% verified service history, transparent prices, and instant WhatsApp booking.
                </p>
              </div>

              {/* Filters & Search Component */}
              <CarFilters
                filters={filters}
                setFilters={setFilters}
                resetFilters={resetFilters}
                totalFiltered={filteredCars.length}
                totalAll={cars.length}
                cars={cars}
              />

              {/* Cars Grid or Empty State */}
              {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  {filteredCars.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      onViewDetails={(c) => setSelectedCar(c)}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-12 text-center max-w-xl mx-auto space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-800 text-neutral-400">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">
                    No Cars Match Your Filter
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    We couldn't find any vehicles matching your exact search criteria. Try relaxing your filters or contact us directly on WhatsApp — we source cars on demand across Tirunelveli and Tenkasi!
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={resetFilters}
                      className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700 cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                    <a
                      href={getGeneralWhatsAppUrl(
                        'Vanakkam AM Cars Ambai! I am looking for a specific car that was not found in the current website filters. Can you check incoming showroom stock?'
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 flex items-center gap-1.5"
                    >
                      <MessageCircle className="h-3.5 w-3.5 fill-current" />
                      <span>Ask via WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activePage === 'about' && (
          <AboutSection onNavigateToCars={() => setActivePage('cars')} />
        )}

        {activePage === 'sell' && (
          <SellCarSection onNavigateToInventory={() => setActivePage('cars')} />
        )}

        {activePage === 'contact' && <ContactSection />}

        {activePage === 'admin' && <AdminPanel />}
      </main>

      {/* Car Details Modal */}
      <CarDetailsModal
        car={selectedCar}
        onClose={() => setSelectedCar(null)}
      />

      {/* Floating Quick Contact Action Buttons */}
      <aside aria-label="Quick contact" className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        <a
          href={getPhoneCallUrl(settings)}
          id="floating-call-btn"
          className="group flex items-center gap-2 rounded-full bg-neutral-900 border border-neutral-700 pl-3 pr-3.5 py-2.5 text-white shadow-xl hover:bg-neutral-800 hover:border-red-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label={`Call ${settings.businessName} at ${settings.phone}`}
          title={`Call ${settings.businessName}`}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600/20 text-red-400">
            <Phone className="h-3.5 w-3.5" />
          </div>
          <div className="text-left">
            <p className="text-[9px] uppercase font-bold text-red-400 leading-none">Call Showroom</p>
            <p className="text-xs font-bold leading-tight text-white">{settings.phone}</p>
          </div>
        </a>

        <a
          href={getGeneralWhatsAppUrl('', settings)}
          target="_blank"
          rel="noopener noreferrer"
          id="floating-whatsapp-btn"
          className="group flex items-center gap-2.5 rounded-full bg-emerald-600 pl-3.5 pr-4 py-3 text-white shadow-2xl shadow-emerald-950 hover:bg-emerald-500 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label={`Direct WhatsApp chat with ${settings.businessName}`}
          title={`WhatsApp ${settings.businessName}`}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
            <MessageCircle className="h-4 w-4 fill-current text-white" />
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-emerald-100 leading-none">WhatsApp Desk</p>
            <p className="text-xs font-extrabold leading-tight">{settings.whatsapp}</p>
          </div>
        </a>
      </aside>

      {/* Global Toast Notification */}
      {toastMessage && (
        <aside aria-label="Notification" className="fixed top-20 right-5 z-50 rounded-2xl border border-red-600/40 bg-neutral-900/95 px-4 py-3 text-xs font-semibold text-white shadow-2xl shadow-black backdrop-blur-md flex items-center gap-2.5 animate-in slide-in-from-right-4 duration-200">
          <CheckCircle2 className="h-4 w-4 text-red-400 shrink-0" />
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* Footer */}
      <Footer onNavigate={(p) => setActivePage(p)} />
    </div>
  );
};

export default function App() {
  return (
    <CarProvider>
      <MainContent />
    </CarProvider>
  );
}
