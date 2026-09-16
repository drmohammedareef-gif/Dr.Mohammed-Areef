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
import { QuickStats } from './components/QuickStats';
import { BrandSelector } from './components/BrandSelector';
import { FeaturedCarSection } from './components/FeaturedCarSection';
import { SellCarBanner } from './components/SellCarBanner';
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
    <div className="min-h-screen bg-slate-50 text-neutral-900 flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* 1. Sticky premium header */}
      <Navbar />

      {/* Main Content Router based on activePage */}
      <main className="flex-1">
        {activePage === 'home' && (
          <div>
            {/* 2. Large HERO section */}
            <Hero />

            {/* 3. Four feature cards */}
            <QuickStats />

            {/* 4. "Select Your Brand" (Horizontal brand cards) */}
            <BrandSelector />

            {/* 5. "Best Deals on Used Cars" (Real Firebase car listings) */}
            <section className="py-16 sm:py-24 bg-white border-b border-neutral-200/80" id="best-deals-section">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 mb-2">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Certified Showroom Stock</span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight uppercase">
                      Best Deals on Used Cars
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-xl">
                      Explore our handpicked collection of verified pre-owned vehicles. Every car is inspected across 150 points with clear RTO documentation and instant test drives.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActivePage('cars');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors group cursor-pointer"
                  >
                    <span>View All {cars.length} Vehicles</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Best Deals Grid (3/4-columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cars
                    .filter((c) => c.status === 'available')
                    .slice(0, 8)
                    .map((car) => (
                      <CarCard
                        key={car.id}
                        car={car}
                        onViewDetails={(c) => setSelectedCar(c)}
                      />
                    ))}
                </div>

                {/* View Full Inventory Button */}
                <div className="mt-12 text-center">
                  <button
                    onClick={() => {
                      setActivePage('cars');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2.5 rounded-2xl bg-neutral-900 hover:bg-emerald-600 px-8 py-4 text-xs sm:text-sm font-bold text-white uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    <span>Explore Full Inventory ({cars.length} Cars)</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* 6. Large "Featured Car" section */}
            <FeaturedCarSection />

            {/* 7. "Sell Your Car with AM Cars" */}
            <SellCarBanner />

            {/* 8. "Why Choose AM Cars?" */}
            <WhyChooseUs onNavigateToCars={() => setActivePage('cars')} />

            {/* Customer Stories & Testimonials */}
            <Testimonials />

            {/* 9. "Get in Touch" */}
            <ContactSection />
          </div>
        )}

        {activePage === 'cars' && (
          <div className="py-10 sm:py-16 bg-slate-50/70">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
              {/* Header */}
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 mb-3">
                  <CarIcon className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Verified Ambasamudram Inventory</span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                  Available Pre-Owned Cars
                </h1>
                <p className="mt-2 text-sm text-neutral-600">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
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
                <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center max-w-xl mx-auto space-y-4 shadow-md">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500">
                    <AlertCircle className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-neutral-900">
                    No Cars Match Your Filter
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    We couldn't find any vehicles matching your exact search criteria. Try relaxing your filters or contact us directly on WhatsApp — we source cars on demand across Tirunelveli and Tenkasi!
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={resetFilters}
                      className="rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-200 cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                    <a
                      href={getGeneralWhatsAppUrl(
                        'Vanakkam AM Cars Ambai! I am looking for a specific car that was not found in the current website filters. Can you check incoming showroom stock?'
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs"
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
          className="group flex items-center gap-2 rounded-full bg-white border border-neutral-200 pl-3 pr-3.5 py-2.5 text-neutral-900 shadow-lg hover:border-emerald-500 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label={`Call ${settings.businessName} at ${settings.phone}`}
          title={`Call ${settings.businessName}`}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Phone className="h-3.5 w-3.5" />
          </div>
          <div className="text-left">
            <p className="text-[9px] uppercase font-bold text-emerald-700 leading-none">Call Showroom</p>
            <p className="text-xs font-bold leading-tight text-neutral-900">{settings.phone}</p>
          </div>
        </a>

        <a
          href={getGeneralWhatsAppUrl('', settings)}
          target="_blank"
          rel="noopener noreferrer"
          id="floating-whatsapp-btn"
          className="group flex items-center gap-2.5 rounded-full bg-emerald-600 pl-3.5 pr-4 py-3 text-white shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all duration-300 hover:scale-105 active:scale-95"
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
        <aside aria-label="Notification" className="fixed top-20 right-5 z-50 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-xs font-semibold text-neutral-900 shadow-xl flex items-center gap-2.5 animate-in slide-in-from-right-4 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* 10. Premium dark footer */}
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
