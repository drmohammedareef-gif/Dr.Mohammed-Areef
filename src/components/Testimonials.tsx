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
    <section className="py-16 bg-neutral-950/80 border-b border-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-red-600/30 bg-red-600/10 px-3.5 py-1 text-xs font-semibold text-red-400 mb-3">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span>Customer Stories</span>
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Trusted by Happy Drivers in Ambai & Tirunelveli
          </h2>
          <p className="mt-2 text-sm text-neutral-300">
            Real feedback from our satisfied car owners across southern Tamil Nadu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <Quote className="h-6 w-6 text-neutral-600 mb-2 opacity-60" />

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-[11px] text-neutral-400">{rev.location}</p>
                </div>
                <div className="text-right">
                  <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                    {rev.car}
                  </span>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{rev.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
