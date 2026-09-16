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
      desc: 'Your name and personal phone number remain 100% confidential. Zero public spam.',
      icon: ShieldCheck,
    },
    {
      step: '04',
      title: 'Instant Payment',
      desc: 'Direct payment upon sale with verified legal RTO ownership name transfer.',
      icon: UserCheck,
    },
  ];

  return (
    <section className="bg-slate-50/80 py-16 sm:py-24 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 sm:p-12 lg:p-14 shadow-lg">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Hassle-Free Direct Brokerage</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight uppercase">
              Sell Your Car with <span className="text-emerald-600">AM Cars</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Skip the frustration of public classified ads, lowball dealer offers, and endless nuisance calls. AM Cars Ambai connects your vehicle directly to verified serious buyers across Tamil Nadu while keeping your identity private.
            </p>

            <div className="pt-2">
              <button
                id="sell-banner-cta-btn"
                onClick={handleSellClick}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <span>SELL YOUR CAR</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* 4 Process Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-neutral-100">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="relative rounded-2xl border border-neutral-100 bg-neutral-50/60 p-5 hover:bg-white hover:border-emerald-200 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display text-2xl font-black text-emerald-600/40">
                      {s.step}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h4 className="font-display text-sm font-bold text-neutral-900 mb-1">
                    {s.title}
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Privacy Guarantee Note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-neutral-500 text-center">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              <strong>100% Privacy Assurance:</strong> Your contact number is strictly confidential and never displayed publicly.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
