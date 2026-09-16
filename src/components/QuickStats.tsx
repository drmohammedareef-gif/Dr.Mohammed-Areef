import React from 'react';
import { ShieldCheck, Wrench, Banknote, Sparkles } from 'lucide-react';

export const QuickStats: React.FC = () => {
  const stats = [
    {
      icon: ShieldCheck,
      title: 'Quality Cars',
      subtitle: '150-Point Certified Inspection',
      desc: 'Non-accidental & genuine odometer guarantee on all cars.',
    },
    {
      icon: Wrench,
      title: 'Trusted Service',
      subtitle: 'Verified Service Records',
      desc: 'Complete authorized dealer service history & clear titles.',
    },
    {
      icon: Banknote,
      title: 'Easy Buying',
      subtitle: 'Spot Delivery & Fast EMI',
      desc: 'Quick loan tie-ups with low interest & minimal documentation.',
    },
    {
      icon: Sparkles,
      title: 'Easy Selling',
      subtitle: 'Confidential Brokerage',
      desc: 'Sell for the best price without public spam or nuisance calls.',
    },
  ];

  return (
    <section className="relative bg-neutral-950 border-y border-neutral-900 py-8">
      {/* Subtle background red accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-red-600/40 hover:bg-neutral-900/90 hover:shadow-lg hover:shadow-red-950/20"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600/20 to-neutral-900 text-red-500 border border-red-500/20 group-hover:border-red-500/50 group-hover:scale-105 transition-all">
                    <Icon className="h-6 w-6 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-extrabold text-white group-hover:text-red-400 transition-colors">
                      {stat.title}
                    </h3>
                    <p className="text-xs font-semibold text-neutral-300 mt-0.5">
                      {stat.subtitle}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                      {stat.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
