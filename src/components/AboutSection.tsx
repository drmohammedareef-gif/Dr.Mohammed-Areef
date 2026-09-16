import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  MessageCircle,
  Phone
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from '../utils/formatters';

export const AboutSection: React.FC<{ onNavigateToCars: () => void }> = ({ onNavigateToCars }) => {
  const { settings } = useCars();

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-neutral-950">
      {/* Subtle red glow in background */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/10 blur-[130px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Showroom Image & Stats Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl border border-neutral-800 bg-neutral-900 p-2.5 overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-950">
                <img
                  src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80"
                  alt={`${settings.businessName} Fleet`}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Stat callout card */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-neutral-800 bg-neutral-950/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl">
                <div className="grid grid-cols-3 gap-2 text-center divide-x divide-neutral-800">
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-black text-red-500">150+</p>
                    <p className="text-[11px] text-neutral-300 font-medium">Cars Delivered</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-black text-white">100%</p>
                    <p className="text-[11px] text-neutral-300 font-medium">Clear RC Papers</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-black text-emerald-400">4.9★</p>
                    <p className="text-[11px] text-neutral-300 font-medium">Customer Trust</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Local service towns */}
            <div className="flex flex-wrap gap-2 text-xs text-neutral-400 justify-center sm:justify-start">
              <span className="rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-neutral-300">
                Ambasamudram (Ambai)
              </span>
              <span className="rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-neutral-300">
                Tirunelveli
              </span>
              <span className="rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-neutral-300">
                Tenkasi
              </span>
              <span className="rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-neutral-300">
                Cheranmahadevi
              </span>
              <span className="rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-neutral-300">
                Alangulam
              </span>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-600/10 px-3.5 py-1 text-xs font-bold text-red-400">
              <Building2 className="h-3.5 w-3.5 text-red-500" />
              <span>ABOUT {settings.businessName.toUpperCase()}</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-tight">
              Rooted in Trust, Driven by <br />
              <span className="text-red-500">Automotive Excellence</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Located in the heart of <strong className="text-white">Ambasamudram (Ambai)</strong>, Tirunelveli District, <strong className="text-white">{settings.businessName}</strong> was established to elevate the pre-owned automobile buying and selling experience across Southern Tamil Nadu.
            </p>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Every vehicle in our showroom undergoes a stringent 150-point technical inspection and complete legal title verification. From reliable family hatchbacks to commanding SUVs, our mission is to deliver exceptional cars at honest market values.
            </p>

            {/* Guarantees list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-neutral-200">
                <CheckCircle2 className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-semibold">Strict No-Accident Guarantee:</strong> We inspect chassis pillars, aprons, and underbody rigorously. Zero accidental or flood-affected vehicles.
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-neutral-200">
                <CheckCircle2 className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-semibold">End-to-End RTO Transfer:</strong> From Form 29/30 signing to verified RC book transfer in your name, our dedicated team manages all paperwork.
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-neutral-200">
                <CheckCircle2 className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-semibold">Transparent Exchange & Fair Value:</strong> Upgrade your current car with quick evaluation and honest market value on the spot.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={onNavigateToCars}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-950/40 cursor-pointer"
              >
                <span>Browse Inventory</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href={getPhoneCallUrl(settings)}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900 px-5 py-3.5 text-xs sm:text-sm font-bold text-neutral-200 hover:text-white hover:border-red-600 transition-colors"
                title={`Call ${settings.businessName} at ${settings.phone}`}
              >
                <Phone className="h-4 w-4 text-red-500" />
                <span>Call {settings.phone}</span>
              </a>

              <a
                href={getGeneralWhatsAppUrl('', settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-emerald-500 transition-colors shadow"
                title={`WhatsApp ${settings.businessName} at ${settings.whatsapp}`}
              >
                <MessageCircle className="h-4 w-4 fill-current text-white" />
                <span>WhatsApp: {settings.whatsapp}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
