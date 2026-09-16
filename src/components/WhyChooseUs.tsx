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
    <section className="bg-white py-16 sm:py-24 border-b border-neutral-200/80">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>THE AM CARS AMBAI STANDARD</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight uppercase">
            Why Choose <span className="text-emerald-600">AM Cars?</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed">
            We are redefining the pre-owned automobile buying experience in Tamil Nadu through uncompromising standards, ethical brokerage, and personalized customer care.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-neutral-200 bg-slate-50/60 p-6 sm:p-7 hover:bg-white hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors mb-5 shadow-xs">
                  <Icon className="h-6 w-6 stroke-[2]" />
                </div>
                <h3 className="font-display text-lg font-extrabold text-neutral-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-emerald-700 mb-2">
                  {item.tagline}
                </p>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom micro-banner */}
        <div className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-neutral-900">
                Ready to find your ideal car in Ambasamudram?
              </p>
              <p className="text-xs text-neutral-500">
                Call our showroom advisors directly for personal assistance and test drives.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={getPhoneCallUrl(settings)}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-emerald-400" />
              <span>{settings.phone}</span>
            </a>
            <a
              href={getGeneralWhatsAppUrl('', settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <MessageCircle className="h-3.5 w-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
