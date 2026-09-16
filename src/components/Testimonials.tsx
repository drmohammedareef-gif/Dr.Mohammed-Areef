import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Murugesan Pandian',
      location: 'Ambasamudram',
      car: 'Hyundai Creta Diesel',
      quote:
        'Bought my Creta from AM Cars Ambai. The car was in showroom condition with zero hidden issues. They completed the TN-72 RC name transfer within 10 days without any hassle. Highly recommended for people in Ambai and surrounding towns!',
      rating: 5,
      date: 'February 2026',
    },
    {
      name: 'Senthil Nathan',
      location: 'Cheranmahadevi',
      car: 'Maruti Swift Dzire',
      quote:
        'Very polite and transparent dealer. They showed complete authorized service history and allowed a long test drive on the bypass highway. No broker commission, straight and clean deal.',
      rating: 5,
      date: 'January 2026',
    },
    {
      name: 'K. Rajasekaran',
      location: 'Tirunelveli Town',
      car: 'Toyota Innova Crysta',
      quote:
        'Found AM Cars through WhatsApp. Traveled from Tirunelveli to inspect the Innova. The car was 100% genuine as described. They also helped with vehicle finance at a good interest rate.',
      rating: 5,
      date: 'March 2026',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 mb-3">
            <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
            <span>Customer Testimonials</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight uppercase">
            Trusted Across Ambai & Tirunelveli
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600">
            Real feedback from our satisfied car owners across southern Tamil Nadu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="relative rounded-3xl border border-neutral-200 bg-white p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <Quote className="h-6 w-6 text-emerald-600/30 mb-2" />

                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic mb-6">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <h4 className="font-display text-sm font-bold text-neutral-900">
                    {rev.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    {rev.location} • <span className="text-emerald-700 font-semibold">{rev.car}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
