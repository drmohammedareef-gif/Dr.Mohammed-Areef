import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Banknote, UserCheck } from 'lucide-react';
import { useCars } from '../context/CarContext';

export const SellCarBanner: React.FC = () => {
  const { setActivePage } = useCars();

  const handleSellClick = () => {
    setActivePage('sell');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    {
      step: '01',
      title: 'Submit Vehicle Specs',
      desc: 'Fill in your car brand, model, year, photos, and expected price in under 2 minutes.',
      icon: Clock,
    },
    {
      step: '02',
      title: 'Free Evaluation',
      desc: 'Our AM Cars Ambai expert evaluates your car for peak fair market value.',
      icon: Banknote,
    },
    {
      step: '03',
      title: 'Private Brokerage',
      desc: 'Your name and personal phone number remain 100% confidential. No spam calls.',
      icon: ShieldCheck,
    },
    {
      step: '04',
      title: 'Instant Payment',
      desc: 'Direct payment to your bank upon sale with verified legal RC name transfer.',
      icon: UserCheck,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-neutral-950 py-16 sm:py-24 border-b border-neutral-900">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-red-600/30 blur-3xl" />
        <div className="absolute top-0 right-10 h-72 w-72 rounded-full bg-neutral-800/40 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-8 sm:p-12 lg:p-14 backdrop-blur-xl shadow-2xl">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-600/40 bg-red-600/10 px-4 py-1.5 text-xs font-bold text-red-400">
              <Sparkles className="h-3.5 w-3.5 text-red-500" />
              <span>Hassle-Free Direct Brokerage</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
              SELL YOUR CAR WITH <span className="text-red-500">AM CARS</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              Skip the frustration of public classified ads, lowball dealer offers, and endless nuisance calls. AM Cars Ambai connects your vehicle to verified serious buyers across Tamil Nadu while keeping your identity private.
            </p>

            <div className="pt-2">
              <button
                id="sell-banner-cta-btn"
                onClick={handleSellClick}
                className="inline-flex items-center gap-2.5 rounded-xl bg-red-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-red-600/30 hover:bg-red-500 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <span>SELL YOUR CAR</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* 4 Process Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-neutral-800/80">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 backdrop-blur hover:border-red-600/40 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-2xl font-black text-neutral-600 group-hover:text-red-500/80 transition-colors">
                      {s.step}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-red-400 group-hover:border-red-500/40">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="font-display text-base font-bold text-white mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
