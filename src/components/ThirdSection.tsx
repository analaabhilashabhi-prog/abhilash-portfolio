import React, { useEffect, useRef, useState } from 'react';

export const ThirdSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Track scroll progress through this section
      const totalScrollable = rect.height - windowH;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // CIRCLE TO ROUNDED RECTANGLE CHOREOGRAPHY:
  // Starts IMMEDIATELY over Section 2 with NO empty gray gap
  // Smooth cubic ease-out for immediate tactile response
  const easeProgress = Math.sin((scrollProgress * Math.PI) / 2);

  // 1. Immediate Vertical Rise:
  // Starts at 55% translateY and immediately climbs to 0%
  const translateYPercent = Math.max((1 - easeProgress) * 55, 0);

  // 2. Width Expansion:
  // Starts at 55vw (dome width) and expands to 100% width
  const widthPercent = Math.min(55 + easeProgress * 45, 100);

  // 3. Top Radius Morph:
  // Starts as a half-circle dome (500px / 50%) and smoothly morphs into a rounded rectangle (28px)
  const topRadius = Math.round(500 - easeProgress * 472); // 500px -> 28px

  // 4. Bottom Radius Morph:
  // Starts flat (0px) at the bottom edge and rounds to 28px as it locks
  const bottomRadius = Math.round(easeProgress * 28); // 0px -> 28px

  return (
    /* OUTER RUNWAY:
       - Uses -mt-screen to overlap Section 2 seamlessly
       - bg-transparent so there is NO EMPTY GRAY GAP above the circle!
       - Section 2 is visible behind the rising half-circle until covered
    */
    <section
      ref={containerRef}
      id="third-section"
      className="relative z-20 w-full h-[200vh] -mt-screen pointer-events-none bg-transparent"
    >
      {/* STICKY FULL-SCREEN FRAME: Transparent wrapper so Section 2 stays visible behind */}
      <div className="sticky top-0 w-full h-screen p-2.5 sm:p-3.5 md:p-4.5 flex flex-col justify-end items-center overflow-hidden bg-transparent">
        {/* THE SINGLE MORPHING SHAPE:
            - Starts IMMEDIATELY as a half-circle dome rising from the bottom
            - Morphs into a rounded rectangle as you scroll
            - Background color: #a6a3a4 (user's given color, NOT black, NOT white)
            - Border: #5a5a55
            - NO empty space above it: Section 2 content is seen until this shape covers it!
        */}
        <div
          className="shadow-[0_-25px_60px_rgba(0,0,0,0.5)] border-2 border-[#5a5a55] flex flex-col justify-center items-center text-center relative overflow-hidden transition-all duration-75 ease-out will-change-transform pointer-events-auto select-none"
          style={{
            backgroundColor: '#a6a3a4',
            width: `${widthPercent}%`,
            height: 'calc(100vh - 1.5rem)',
            borderTopLeftRadius: `${topRadius}px`,
            borderTopRightRadius: `${topRadius}px`,
            borderBottomLeftRadius: `${bottomRadius}px`,
            borderBottomRightRadius: `${bottomRadius}px`,
            transform: `translateY(${translateYPercent}%)`,
          }}
        >
          {/* Subtle ambient lighting */}
          <div className="absolute inset-0 bg-radial from-white/[0.12] via-transparent to-black/[0.05] pointer-events-none" />

          {/* Placeholder Content: Fades in as rectangle locks into place */}
          <div
            className={`w-full max-w-4xl mx-auto px-6 sm:px-10 flex flex-col items-center justify-center transition-all duration-500 ${
              scrollProgress >= 0.6
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5a5a55]/15 border border-[#5a5a55]/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#5a5a55] animate-pulse" />
              <span className="text-[12px] uppercase tracking-widest font-semibold text-[#000000]">
                Section 03 &bull; Morphing Complete
              </span>
            </div>

            <h2
              className="text-[34px] sm:text-[48px] md:text-[58px] font-bold text-[#000000] tracking-[-0.03em] leading-tight mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Ready for Your Content
            </h2>

            <p className="text-[#000000]/80 text-[16px] sm:text-[19px] max-w-xl leading-relaxed">
              Tell me what you&apos;d like to showcase inside this rounded rectangle, and I will build it with the exact design and interactions you want!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
