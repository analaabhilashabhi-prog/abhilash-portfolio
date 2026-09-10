import React from 'react';
import logo1Url from '../../assets/logos/logo-dotted-1.svg';

export interface LogoItem {
  id: string;
  src: string;
  alt: string;
  name?: string;
}

// Current list of logos (ready to receive upcoming user logos)
const defaultLogos: LogoItem[] = [
  { id: 'dotted-logo-1', src: logo1Url, alt: 'Brand Logo 1', name: 'Partner 1' },
  { id: 'dotted-logo-2', src: logo1Url, alt: 'Brand Logo 2', name: 'Partner 2' },
  { id: 'dotted-logo-3', src: logo1Url, alt: 'Brand Logo 3', name: 'Partner 3' },
  { id: 'dotted-logo-4', src: logo1Url, alt: 'Brand Logo 4', name: 'Partner 4' },
  { id: 'dotted-logo-5', src: logo1Url, alt: 'Brand Logo 5', name: 'Partner 5' },
  { id: 'dotted-logo-6', src: logo1Url, alt: 'Brand Logo 6', name: 'Partner 6' },
];

export interface LogoMarqueeProps {
  logos?: LogoItem[];
  speedSeconds?: number;
  className?: string;
}

export const LogoMarquee: React.FC<LogoMarqueeProps> = ({
  logos = defaultLogos,
  speedSeconds = 36,
  className = '',
}) => {
  // We duplicate the list twice to create a seamless infinite loop
  const trackItems = [...logos, ...logos];

  return (
    <div
      className={`relative w-full overflow-hidden select-none py-4 sm:py-6 ${className}`}
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, transparent 100%)',
      }}
    >
      <div
        className="flex items-center w-max animate-marquee hover:[animation-play-state:paused]"
        style={{
          animationDuration: `${speedSeconds}s`,
        }}
      >
        {trackItems.map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="flex items-center justify-center mx-8 sm:mx-12 md:mx-16 lg:mx-20 shrink-0 group"
          >
            <div className="relative flex items-center justify-center p-2 rounded-2xl transition-all duration-300 group-hover:scale-105">
              {/* Halftone / Dotted Logo SVG with magnified dot structure */}
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-24 sm:h-28 md:h-36 lg:h-40 xl:h-44 w-auto object-contain opacity-95 group-hover:opacity-100 transition-all duration-300 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.06)] pointer-events-none"
                loading="eager"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
