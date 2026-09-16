import React from 'react';

interface AmCarsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  showTextBeside?: boolean;
  lightMode?: boolean; // When placed on light surfaces, text beside is dark
}

export const AmCarsLogo: React.FC<AmCarsLogoProps> = ({
  className = '',
  size = 'md',
  showTextBeside = true,
  lightMode = true,
}) => {
  // Dimension mapping for the circular logo
  const sizeMap = {
    sm: 'h-9 w-9 sm:h-10 sm:w-10',
    md: 'h-11 w-11 sm:h-12 sm:w-12',
    lg: 'h-14 w-14 sm:h-16 sm:w-16',
    xl: 'h-20 w-20 sm:h-24 sm:w-24',
    custom: '',
  };

  const circleDimensions = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Exact AM CARS AMBAI Official Logo: Black circular background, white car/key icon, and AM CARS AMBAI text */}
      <div
        className={`relative shrink-0 rounded-full overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105 ${circleDimensions}`}
        style={{ aspectRatio: '1 / 1' }}
      >
        <img
          src="/logo.svg"
          alt="AM CARS AMBAI Official Logo"
          className="h-full w-full object-contain select-none"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Brand typography displayed alongside */}
      {showTextBeside && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`font-display text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-none uppercase transition-colors ${
                lightMode
                  ? 'text-neutral-900 group-hover:text-emerald-700'
                  : 'text-white group-hover:text-emerald-400'
              }`}
            >
              AM CARS
            </span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
                lightMode
                  ? 'bg-neutral-900 text-white border border-neutral-800'
                  : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              AMBAI
            </span>
          </div>
          <p
            className={`text-[9px] sm:text-[10px] md:text-[11px] font-semibold tracking-wider uppercase mt-0.5 ${
              lightMode ? 'text-neutral-500' : 'text-neutral-400'
            }`}
          >
            Pre-Owned Automotive Marketplace
          </p>
        </div>
      )}
    </div>
  );
};
