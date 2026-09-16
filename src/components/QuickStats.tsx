import React from 'react';
import { ShieldCheck, Wrench, Banknote, Sparkles } from 'lucide-react';

export const QuickStats: React.FC = () => {
  const stats = [
    {
      icon: ShieldCheck,
      title: 'Quality Cars',
      subtitle: '150-Point Certified Inspection',
      desc: 'Non-accidental and genuine odometer guarantee on all verified showroom cars.',
    },
    {
      icon: Wrench,
      title: 'Trusted Service',
      subtitle: 'Verified Service History',
      desc: 'Complete authorized dealer records, transparent title checks, and no surprises.',
    },
    {
      icon: Banknote,
      title: 'Easy Buying',
      subtitle: 'Spot Delivery & Fast EMI',
      desc: 'Quick vehicle loan tie-ups with leading banks at attractive low interest rates.',
    },
    {
      icon: Sparkles,
      title: 'Easy Selling',
      subtitle: 'Private Brokerage Service',
      desc: 'Sell for true market value. Your contact details remain 100% confidential.',
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-16 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-neutral-200/90 bg-neutral-50/70 hover:bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-emerald-500/40"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-extrabold text-neutral-900 group-hover:text-emerald-700 transition-colors">
                      {stat.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700">
                      {stat.subtitle}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
