import React from 'react';
import { 
  ShieldCheck, 
  BadgeIndianRupee, 
  Clock, 
  HeadphonesIcon, 
  Sparkles, 
  Phone, 
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from '../utils/formatters';
import { useCars } from '../context/CarContext';

export const WhyChooseUs: React.FC<{ onNavigateToCars: () => void }> = ({ onNavigateToCars }) => {
  const { settings } = useCars();

  const features = [
    {
      icon: ShieldCheck,
      title: 'Trusted Cars',
      tagline: '150-Point Quality Inspected',
      description:
        'Every vehicle is thoroughly audited across chassis, engine health, electrical systems, and structural integrity. Zero accidental or flood-damaged cars guaranteed.',
    },
    {
      icon: BadgeIndianRupee,
      title: 'Transparent Pricing',
      tagline: 'Direct Fair Market Value',
      description:
        'Clear, competitive pricing with absolutely no hidden broker markups or unexpected fees. What you see is what you pay, backed by comprehensive invoices.',
    },
    {
      icon: Clock,
      title: 'Easy Process',
      tagline: 'Spot Delivery & Fast RTO Transfer',
      description:
        'From vehicle selection and test drive to instant loan approval and RTO ownership name change, our dedicated team handles every step seamlessly.',
    },
    {
      icon: HeadphonesIcon,
      title: 'Customer Support',
      tagline: 'Dedicated Lifetime Assistance',
      description:
        'Our Ambasamudram showroom team is always one WhatsApp message or phone call away for service guidance, documentation help, and vehicle support.',
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-neutral-950 border-b border-neutral-900">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[130px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-600/10 px-3.5 py-1 text-xs font-bold text-red-400 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-red-500" />
            <span>THE AM CARS AMBAI STANDARD</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
            WHY <span className="text-red-500">AM CARS</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            We are redefining the pre-owned automobile buying experience in Tamil Nadu through uncompromising standards, ethical brokerage, and personalized care.
          </p>
        </div>

        {/* 4 Premium Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl border border-neutral-800 bg-neutral-900/70 p-7 backdrop-blur-md hover:border-red-600/50 hover:bg-neutral-900 hover:shadow-2xl hover:shadow-red-950/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 border border-neutral-800 text-red-500 group-hover:border-red-500/50 group-hover:bg-red-600/10 group-hover:scale-105 transition-all shadow-inner">
                    <Icon className="h-7 w-7 stroke-[2]" />
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-white group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-bold text-neutral-300 mt-1 mb-3">
                    {item.tagline}
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center text-[11px] font-bold text-red-500 group-hover:text-red-400">
                  <span>Verified Standard</span>
                  <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onNavigateToCars}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition-all active:scale-95 cursor-pointer"
          >
            <span>Explore All Cars</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <a
            href={getPhoneCallUrl(settings)}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900 px-6 py-3.5 text-xs sm:text-sm font-bold text-neutral-200 hover:text-white hover:border-neutral-500 transition-all"
          >
            <Phone className="h-4 w-4 text-red-500" />
            <span>Call {settings.phone}</span>
          </a>

          <a
            href={getGeneralWhatsAppUrl('', settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-emerald-500 transition-all shadow-md"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
