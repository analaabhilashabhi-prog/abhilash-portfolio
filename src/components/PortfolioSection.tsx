import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MetricBarChartCard } from './ui/BarChart';
import { MetricChoroplethCard } from './ui/ChoroplethChart';
import { MetricSunburstCard } from './ui/SunburstChart';
import { MetricGaugeCard } from './ui/GaugeChart';
import { ToolsGridSection } from './ui/ToolsGridSection';

gsap.registerPlugin(ScrollTrigger);

interface MetricCard {
  id: string;
  targetNumber: number;
  suffix: string;
  title: string;
  subtitle: string;
  category: string;
  imageSrc?: string;
  details: {
    heading: string;
    points: string[];
    stat: string;
  };
}

// Hook for smooth number counter animation
const useCountUp = (target: number, duration: number = 1000, trigger: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, trigger]);

  return count;
};

// Sub-component for each of the 4 Big Boxes
const BigMetricBox: React.FC<{
  card: MetricCard;
  index: number;
  isVisible: boolean;
  onSelect: (card: MetricCard) => void;
}> = ({ card, index, isVisible, onSelect }) => {
  const animatedNumber = useCountUp(card.targetNumber, 1000, isVisible);

  return (
    <div
      onClick={() => onSelect(card)}
      className={`metric-box-${index} group relative bg-[#121212] hover:bg-[#181818] border border-white/[0.08] hover:border-white/25 rounded-[24px] sm:rounded-[28px] overflow-hidden flex flex-col justify-between h-full cursor-pointer hover:-translate-y-2.5 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95)] shadow-2xl transition-all duration-300 will-change-transform select-none`}
    >
      {/* Top Visual Container: Substantial, well-proportioned height */}
      <div className="relative w-full h-[200px] sm:h-[215px] md:h-[225px] lg:h-[235px] xl:h-[245px] bg-[#0c0c0c] border-b border-white/[0.06] overflow-hidden flex items-center justify-center p-3.5 sm:p-5 select-none">
        <div className="absolute inset-0 bg-radial from-white/[0.04] to-transparent pointer-events-none" />

        {/* Subtle Dotted Grid Background behind the graphs */}
        <div
          className="absolute inset-0 pointer-events-none opacity-45"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255, 255, 255, 0.22) 1.2px, transparent 1.2px)',
            backgroundSize: '16px 16px',
            backgroundPosition: 'center center',
            maskImage:
              'radial-gradient(ellipse 90% 85% at 50% 50%, #000 65%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 85% at 50% 50%, #000 65%, transparent 100%)',
          }}
        />

        {card.imageSrc ? (
          <img
            src={card.imageSrc}
            alt={card.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            {/* BOX 1: 3+ Years Analytics Bar Chart with Thick Bars */}
            {index === 0 && (
              <div className="box-graphic-0 w-full h-full flex items-center justify-center p-1 will-change-transform">
                <MetricBarChartCard isVisible={isVisible} />
              </div>
            )}

            {/* BOX 2: 5 Global Certifications Choropleth Map Chart */}
            {index === 1 && (
              <div className="box-graphic-1 w-full h-full flex items-center justify-center p-1 will-change-transform">
                <MetricChoroplethCard isVisible={isVisible} />
              </div>
            )}

            {/* BOX 3: 50+ BI Solutions Sunburst Chart */}
            {index === 2 && (
              <div className="box-graphic-2 w-full h-full flex items-center justify-center p-1 will-change-transform">
                <MetricSunburstCard isVisible={isVisible} />
              </div>
            )}

            {/* BOX 4: 300K+ Records Data Pipeline Gauge Chart */}
            {index === 3 && (
              <div className="box-graphic-3 w-full h-full flex items-center justify-center p-1 will-change-transform">
                <MetricGaugeCard isVisible={isVisible} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Area: Prominent Count + Title */}
      <div className="p-5 sm:p-6 flex items-end justify-between gap-3 bg-[#141414]/90 border-t border-white/[0.04]">
        <div>
          {/* Big Animated Count */}
          <div
            className="text-[34px] sm:text-[38px] md:text-[44px] font-bold text-white tracking-tight leading-none mb-1 select-none"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {animatedNumber}
            {card.suffix}
          </div>

          {/* Primary Metric Label */}
          <h3 className="text-[14.5px] sm:text-[16px] font-bold text-white tracking-tight leading-snug group-hover:text-white">
            {card.title}
          </h3>

          {/* Subtitle / Context */}
          <div className="text-[11.5px] sm:text-[12.5px] text-white/50 font-normal mt-0.5">
            {card.subtitle}
          </div>
        </div>

        {/* Plus Button that rotates on hover */}
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full border border-white/15 flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/40 group-hover:rotate-90 group-hover:bg-white/10 transition-all duration-300 shadow-md"
          title="View details"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const PortfolioSection: React.FC<{
  onScrollProgress?: (progress: number) => void;
}> = ({ onScrollProgress }) => {
  const runwayRef = useRef<HTMLElement>(null);
  const section2CardRef = useRef<HTMLDivElement>(null);
  const section2HeaderRef = useRef<HTMLDivElement>(null);
  const section2ContentRef = useRef<HTMLDivElement>(null);

  const [activeCards, setActiveCards] = useState({
    card1: false,
    card2: false,
    card3: false,
    card4: false,
  });

  const [selectedCard, setSelectedCard] = useState<MetricCard | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: runwayRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2, // Apple-grade smooth physics damping
          onUpdate: (self) => {
            const p = self.progress;
            setActiveCards({
              card1: p >= 0.16,
              card2: p >= 0.28,
              card3: p >= 0.40,
              card4: p >= 0.52,
            });
            if (onScrollProgress) {
              onScrollProgress(p);
            }
          },
        },
      });

      // 1. SECTION 2 HEADER PARALLAX FLOAT (0.0 to 1.2)
      tl.fromTo(
        section2HeaderRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
        },
        0.0
      );

      // 2. THE 4 BIG BOXES - STAGGERED PARALLAX TRAVEL (0.6 to 4.6)
      // Box 1:
      tl.fromTo(
        '.metric-box-0',
        { y: 100, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.6
      );
      // Box 2 (parallax staggered):
      tl.fromTo(
        '.metric-box-1',
        { y: 120, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        1.4
      );
      // Box 3 (parallax staggered):
      tl.fromTo(
        '.metric-box-2',
        { y: 140, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        2.2
      );
      // Box 4 (parallax staggered):
      tl.fromTo(
        '.metric-box-3',
        { y: 160, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        3.0
      );

      // Experience & Work Description entrance
      tl.fromTo(
        '.footprint-wrapper',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        3.2
      );

      // Micro-parallax inside boxes (multi-layered optical depth):
      tl.fromTo('.box-graphic-0', { y: 18 }, { y: 0, ease: 'none' }, 0.7);
      tl.fromTo('.box-graphic-1', { scale: 0.88, y: 14 }, { scale: 1, y: 0, ease: 'none' }, 1.5);
      tl.fromTo('.box-graphic-2', { y: 18 }, { y: 0, ease: 'none' }, 2.3);
      tl.fromTo('.box-graphic-3', { y: 18 }, { y: 0, ease: 'none' }, 3.1);

      // 3. DWELL PERIOD (3.6 to 4.8) - Section 2 cards & description fully settled, interactive, clickable
      tl.to({}, { duration: 1.2 }, 3.6);

      // 4. PARALLAX CONTINUOUS SCROLL: Moves up cleanly to Section 3 (4.8 to 6.6)
      // (Background stays completely still on pure black, NO fade-out / fade-in!)
      tl.to(
        section2ContentRef.current,
        {
          y: () => -(window.innerHeight + 380),
          ease: 'power1.inOut',
          duration: 1.8,
        },
        4.8
      );

      // 5. SECTION 3 PINNED FINISH & DWELL (6.6 to 8.2) - Tools grid settled and interactive
      tl.to({}, { duration: 1.6 }, 6.6);
    }, runwayRef);

    return () => ctx.revert();
  }, [onScrollProgress]);

  const cards: MetricCard[] = [
    {
      id: 'years-experience',
      targetNumber: 3,
      suffix: '+',
      title: 'Years Experience',
      subtitle: 'Analytics & Automation',
      category: 'Track Record',
      details: {
        heading: 'Analytics & Power Platform Engineering',
        points: [
          '3+ years turning complex operational data into actionable dashboards',
          'End-to-end data pipelines across Power BI, SQL, Excel, and Snowflake',
          'Training 700+ students and professionals in modern analytics',
        ],
        stat: '3+ Years Proven',
      },
    },
    {
      id: 'certifications',
      targetNumber: 5,
      suffix: '',
      title: 'Global Certifications',
      subtitle: 'Microsoft • Oracle • Snowflake',
      category: 'Credentials',
      details: {
        heading: 'Globally Certified Expertise',
        points: [
          'Microsoft Certified: Power BI Data Analyst Associate (PL-300)',
          'Microsoft Certified: Fabric Analytics Engineer (DP-600)',
          'Snowflake Core Certified & Oracle Cloud Infrastructure Certified',
        ],
        stat: '5 Global Badges',
      },
    },
    {
      id: 'bi-solutions',
      targetNumber: 50,
      suffix: '+',
      title: 'BI Solutions Delivered',
      subtitle: 'Enterprise Dashboards',
      category: 'Production Delivery',
      details: {
        heading: 'End-to-End Solution Architecture',
        points: [
          'Production-grade automated dashboards driving C-suite decisions',
          'Advanced DAX calculations, row-level security (RLS), and star-schemas',
          'Power Automate scheduled reporting and real-time operational alerts',
        ],
        stat: '50+ Deployed',
      },
    },
    {
      id: 'records-processed',
      targetNumber: 300,
      suffix: 'K+',
      title: 'Records Processed',
      subtitle: 'High-Throughput Pipelines',
      category: 'Data Scale',
      details: {
        heading: 'High-Performance Data Infrastructure',
        points: [
          'Star-schema modeling optimized for sub-second query performance',
          'Power Query & SQL ETL pipelines processing 300K+ transaction rows',
          'Zero-loss automated extraction, transformation, and incremental loading',
        ],
        stat: '300,000+ Rows',
      },
    },
  ];

  return (
    /* MASTER GSAP SCROLL RUNWAY: Pure black (#000000) end-to-end */
    <section
      ref={runwayRef}
      id="portfolio-section"
      className="relative z-10 w-full h-[800vh] bg-[#000000]"
    >
      {/* STICKY FULL-SCREEN VIEWPORT CONTAINER - STAYS STILL ON PURE BLACK */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden bg-[#000000]">
        {/* SECTION 2 STAGE: 100% Pure Black End-to-End, top-aligned in previous exact location */}
        <div
          ref={section2CardRef}
          className="w-full h-full bg-[#000000] text-white px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 py-6 sm:py-8 md:py-9 lg:py-10 flex flex-col justify-start overflow-hidden relative z-10 will-change-transform"
        >
          <div
            ref={section2ContentRef}
            className="w-full max-w-[1720px] mx-auto flex flex-col justify-start will-change-transform"
          >
            {/* 1. DYNAMIC HEADER & PUNCHLINE */}
            <div
              ref={section2HeaderRef}
              className="w-full will-change-transform origin-top-left flex-shrink-0"
            >
              <h2
                className="text-[30px] sm:text-[40px] md:text-[48px] lg:text-[54px] font-bold text-white tracking-[-0.03em] leading-[1.08] select-none"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Built for Fast Moving
                <br />
                Teams That Need Control.
              </h2>

              <p className="text-white/60 text-[14px] sm:text-[16px] md:text-[17px] leading-relaxed max-w-3xl mt-2 select-none">
                Turning complex operational data into automated BI dashboards, scalable ETL
                pipelines, and actionable decisions.
              </p>
            </div>

            {/* 2. THE 4 METRIC BOXES: Restored to their original position right below header */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-8 items-stretch">
              {cards.map((card, idx) => {
                const isVisible =
                  idx === 0
                    ? activeCards.card1
                    : idx === 1
                    ? activeCards.card2
                    : idx === 2
                    ? activeCards.card3
                    : activeCards.card4;

                return (
                  <BigMetricBox
                    key={card.id}
                    card={card}
                    index={idx}
                    isVisible={isVisible}
                    onSelect={(c) => setSelectedCard(c)}
                  />
                );
              })}
            </div>

            {/* 3. EXPERIENCE & WORK DESCRIPTION */}
            <div className="footprint-wrapper w-full mt-6 sm:mt-8 md:mt-10 select-none">
              <p className="text-white/50 text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed max-w-3xl font-normal">
                Over 3+ years architecting automated BI platforms, scalable cloud data pipelines, and decision-support systems for enterprise clients and cross-functional teams worldwide.
              </p>
            </div>

            {/* 4. SECTION 3: PROFESSIONAL TOOLS & TECH STACK - DIRECTLY BELOW WITH DECENT PADDING & GAP */}
            <div
              id="third-section"
              className="tools-section-block w-full mt-48 sm:mt-64 select-none will-change-transform"
            >
              <ToolsGridSection />
            </div>

          </div>
        </div>
      </div>

      {/* INTERACTIVE DETAIL MODAL */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="relative bg-[#141414] border border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCard(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {selectedCard.category}
            </span>

            <div className="mt-3 mb-2 flex items-baseline gap-3">
              <span
                className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {selectedCard.targetNumber}
                {selectedCard.suffix}
              </span>
              <h3
                className="text-xl font-bold leading-snug"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {selectedCard.title}
              </h3>
            </div>

            <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl p-4 my-5">
              <h4 className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-3">
                {selectedCard.details.heading}
              </h4>
              <ul className="space-y-2">
                {selectedCard.details.points.map((pt, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[13px] text-white/80"
                  >
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-xs text-white/40">Verified Metric</span>
              <span className="text-sm font-semibold font-mono text-emerald-300">
                {selectedCard.details.stat}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioSection;
