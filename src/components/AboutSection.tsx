import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  MessageCircle,
  Phone,
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from '../utils/formatters';

export const AboutSection: React.FC<{ onNavigateToCars: () => void }> = ({ onNavigateToCars }) => {
  const { settings } = useCars();

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-slate-50/70 border-b border-neutral-200/80">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Showroom Image & Stats Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl border border-neutral-200 bg-white p-3 overflow-hidden shadow-xl">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80"
                  alt={`${settings.businessName} Fleet`}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Stat callout card */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-neutral-200/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-xl">
                <div className="grid grid-cols-3 gap-2 text-center divide-x divide-neutral-100">
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-black text-emerald-600">150+</p>
                    <p className="text-[11px] text-neutral-500 font-medium">Cars Delivered</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-black text-neutral-900">100%</p>
                    <p className="text-[11px] text-neutral-500 font-medium">Clear RC Papers</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-black text-emerald-600">4.9★</p>
                    <p className="text-[11px] text-neutral-500 font-medium">Customer Trust</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Local service towns */}
            <div className="flex flex-wrap gap-2 text-xs text-neutral-600 justify-center sm:justify-start">
              <span className="rounded-xl bg-white border border-neutral-200 px-3 py-1.5 text-neutral-700 shadow-2xs">
                Ambasamudram (Ambai)
              </span>
              <span className="rounded-xl bg-white border border-neutral-200 px-3 py-1.5 text-neutral-700 shadow-2xs">
                Tirunelveli
              </span>
              <span className="rounded-xl bg-white border border-neutral-200 px-3 py-1.5 text-neutral-700 shadow-2xs">
                Tenkasi
              </span>
              <span className="rounded-xl bg-white border border-neutral-200 px-3 py-1.5 text-neutral-700 shadow-2xs">
                Cheranmahadevi
              </span>
              <span className="rounded-xl bg-white border border-neutral-200 px-3 py-1.5 text-neutral-700 shadow-2xs">
                Alwarkurichi
              </span>
            </div>
          </div>

          {/* Right Column: Mission & Values */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
              <Building2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>ABOUT AM CARS AMBAI</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              Southern Tamil Nadu's Premier Automotive Choice
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Located in the heart of Ambasamudram, AM Cars Ambai was established with a singular mission: to make pre-owned car buying and selling transparent, straightforward, and secure. We eliminate high-pressure sales tactics and hidden broker fees in favor of honest vehicle appraisals and complete documentation.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display text-sm font-bold text-neutral-900">
                    Rigorous 150-Point Inspection
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    We test compression, transmission shift quality, electronic modules, chassis alignment, and odometer integrity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display text-sm font-bold text-neutral-900">
                    Zero Private Contact Exposure
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    When vehicle owners sell through AM Cars Ambai, private phone numbers are kept completely confidential. Our team conducts all buyer negotiations and test drive coordination.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct contact & inventory triggers */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onNavigateToCars}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700 transition-all cursor-pointer uppercase tracking-wider"
              >
                <span>EXPLORE INVENTORY</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href={getGeneralWhatsAppUrl('', settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-5 py-3.5 text-xs sm:text-sm font-bold text-neutral-800 hover:bg-neutral-50 transition-all shadow-xs"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
