import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MetricBarChartCard } from './ui/BarChart';
import { MetricChoroplethCard } from './ui/ChoroplethChart';
import { MetricSunburstCard } from './ui/SunburstChart';
import { MetricGaugeCard } from './ui/GaugeChart';
import { ToolsGridSection } from './ui/ToolsGridSection';
import { JitterTextReveal } from './ui/JitterTextReveal';

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

// Sub-component for each of the 4 Big Boxes with phased reveals:
// 1. Empty card shell loads first
// 2. Graphs animate in on next scroll
// 3. Numbers animate in & count up on next scroll
const BigMetricBox: React.FC<{
  card: MetricCard;
  index: number;
  showGraphs: boolean;
  showNumbers: boolean;
  onSelect: (card: MetricCard) => void;
}> = ({ card, index, showGraphs, showNumbers, onSelect }) => {
  const animatedNumber = useCountUp(card.targetNumber, 1000, showNumbers);

  return (
    <div
      onClick={() => onSelect(card)}
      className={`metric-box-${index} metric-box-card group relative bg-[#121212] hover:bg-[#181818] border border-white/[0.08] hover:border-white/25 rounded-[26px] sm:rounded-[30px] md:rounded-[32px] overflow-hidden flex flex-col justify-between h-full cursor-pointer hover:-translate-y-2.5 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95)] shadow-2xl transition-all duration-300 will-change-transform select-none`}
    >
      {/* Top Visual Container: Substantial, well-proportioned height with generous padding */}
      <div className="relative w-full h-[195px] sm:h-[215px] md:h-[225px] lg:h-[235px] xl:h-[245px] bg-[#0c0c0c] border-b border-white/[0.06] overflow-hidden flex items-center justify-center p-4 sm:p-5 md:p-6 select-none">
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
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 ${
              showGraphs ? 'opacity-100 scale-100 filter-none' : 'opacity-0 scale-90 blur-[4px]'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Standby placeholder when empty cards are loaded */}
            <div
              className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
                showGraphs ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="flex flex-col items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                <span className="text-[9.5px] font-mono text-white/25 uppercase tracking-widest">
                  Telemetry
                </span>
              </div>
            </div>

            {/* Graphs Layer - Reveals and runs entrance animation on scroll 1 */}
            <div
              className={`w-full h-full flex items-center justify-center transition-all duration-700 transform-gpu ${
                showGraphs
                  ? 'opacity-100 scale-100 filter-none'
                  : 'opacity-0 scale-90 blur-[6px] pointer-events-none'
              }`}
            >
              {/* BOX 1: 3+ Years Analytics Bar Chart with Thick Bars */}
              {index === 0 && (
                <div className="box-graphic-0 w-full h-full flex items-center justify-center p-1 will-change-transform">
                  <MetricBarChartCard isVisible={showGraphs} />
                </div>
              )}

              {/* BOX 2: 5 Global Certifications Choropleth Map Chart */}
              {index === 1 && (
                <div className="box-graphic-1 w-full h-full flex items-center justify-center p-1 will-change-transform">
                  <MetricChoroplethCard isVisible={showGraphs} />
                </div>
              )}

              {/* BOX 3: 50+ BI Solutions Sunburst Chart */}
              {index === 2 && (
                <div className="box-graphic-2 w-full h-full flex items-center justify-center p-1 will-change-transform">
                  <MetricSunburstCard isVisible={showGraphs} />
                </div>
              )}

              {/* BOX 4: 300K+ Records Data Pipeline Gauge Chart */}
              {index === 3 && (
                <div className="box-graphic-3 w-full h-full flex items-center justify-center p-1 will-change-transform">
                  <MetricGaugeCard isVisible={showGraphs} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Area: Prominent Count + Title with Generous Padding */}
      <div className="p-6 sm:p-7 md:p-7.5 flex items-end justify-between gap-3.5 bg-[#141414]/90 border-t border-white/[0.04]">
        <div>
          {/* Big Animated Count - Reveals and counts up on scroll 2 */}
          <div
            className={`text-[34px] sm:text-[38px] md:text-[44px] font-bold text-white tracking-tight leading-none mb-2 sm:mb-2.5 select-none transition-all duration-600 transform-gpu ${
              showNumbers
                ? 'opacity-100 translate-y-0 filter-none'
                : 'opacity-0 translate-y-3 blur-[4px]'
            }`}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {showNumbers ? animatedNumber : 0}
            {card.suffix}
          </div>

          {/* Primary Metric Label */}
          <h3 className="text-[14.5px] sm:text-[16px] font-bold text-white tracking-tight leading-snug group-hover:text-white">
            {card.title}
          </h3>

          {/* Subtitle / Context */}
          <div className="text-[11.5px] sm:text-[12.5px] text-white/50 font-normal mt-1 sm:mt-1.5">
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
  const section2PinRef = useRef<HTMLDivElement>(null);
  const metricsSectionRef = useRef<HTMLDivElement>(null);
  const section2HeaderRef = useRef<HTMLDivElement>(null);

  const [showGraphs, setShowGraphs] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const hasCompletedSequenceRef = useRef(false);

  const [selectedCard, setSelectedCard] = useState<MetricCard | null>(null);
  const [isProjectsIntroActive, setIsProjectsIntroActive] = useState(false);
  const [introKey, setIntroKey] = useState(0);
  const currentZoneRef = useRef<'tools' | 'intro' | 'projects' | 'other'>('other');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Overall scroll tracking to hide Hero background video/navbar
      ScrollTrigger.create({
        trigger: runwayRef.current,
        start: 'top 75%',
        onUpdate: (self) => {
          if (onScrollProgress) {
            onScrollProgress(self.progress);
          }
        },
      });

      const pinEl = section2PinRef.current || metricsSectionRef.current || '#metrics-section';

      // 2. SECTION 2: EMPTY CARDS LOAD ON VIEWPORT ENTRY (NO FADE-OUT ON SCROLL PAST)
      gsap.fromTo(
        section2HeaderRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pinEl,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.metric-box-card',
        { opacity: 0, y: 45, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pinEl,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 3. SECTION 2: NATURAL UNPINNED SCROLL SEQUENCE (NO STUCK / GLITCH FEELING)
      // - Cards, graphs, and telemetry populate smoothly as the user reaches the section
      // - Zero page freeze or pinning so momentum scrolling remains completely fluid
      ScrollTrigger.create({
        trigger: pinEl,
        start: 'top 78%',
        onEnter: () => {
          setShowGraphs(true);
        },
        onLeaveBack: () => {
          setShowGraphs(false);
          setShowNumbers(false);
        },
      });

      ScrollTrigger.create({
        trigger: pinEl,
        start: 'top 52%',
        onEnter: () => {
          setShowNumbers(true);
        },
        onLeaveBack: () => {
          setShowNumbers(false);
        },
      });

      gsap.fromTo(
        '.footprint-wrapper',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.footprint-wrapper',
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 3. SECTION 3: TOOLS STACK REVEAL ON SCROLL (NO FADE-OUT ON SCROLL PAST)
      gsap.fromTo(
        '.tools-left-content',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#third-section-content',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.tool-box-card',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.tools-right-stack',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 4. SECTION 3.5: PROJECTS STATEMENT (DOT ART REVEAL)
      ScrollTrigger.create({
        trigger: '#projects-intro-section',
        start: 'top 75%',
        end: 'bottom 25%',
        onEnter: () => {
          setIntroKey((k) => k + 1);
          setIsProjectsIntroActive(true);
        },
        onEnterBack: () => {
          setIntroKey((k) => k + 1);
          setIsProjectsIntroActive(true);
        },
        onLeave: () => {
          setIsProjectsIntroActive(false);
        },
        onLeaveBack: () => {
          setIsProjectsIntroActive(false);
        },
      });

      // 5. SECTION 4: PROJECTS SHOWCASE REVEAL ON SCROLL (NO FADE-OUT ON SCROLL PAST)
      gsap.fromTo(
        '.fourth-section-title',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#fourth-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.fourth-section-desc',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          delay: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#fourth-section',
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.fourth-section-hands',
        { opacity: 0, y: 65, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#fourth-section',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 6. SECTION 5: SECOND PROJECT SHOWCASE REVEAL (MONITOR ON RIGHT, DETAILS ON LEFT)
      gsap.fromTo(
        '.fifth-section-title',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#fifth-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.fifth-section-desc',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          delay: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#fifth-section',
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.fifth-section-monitor',
        { opacity: 0, y: 65, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#fifth-section',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
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
    /* MASTER PORTFOLIO CONTAINER: Pure black (#000000) natural flow with reference-grade spacing */
    <section
      ref={runwayRef}
      id="portfolio-section"
      className="relative z-10 w-full bg-[#000000] text-white pt-20 sm:pt-28 md:pt-36 pb-20 sm:pb-28 select-none"
    >
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 flex flex-col justify-start">
        {/* SECTION 2: IMPACT METRICS CONTAINER (PINNED MULTI-STEP SEQUENCE) */}
        <div
          ref={section2PinRef}
          id="metrics-pin-container"
          className="w-full relative select-none"
        >
          <div
            ref={metricsSectionRef}
            id="metrics-section"
            className="w-full min-h-screen flex flex-col justify-center py-10 sm:py-14 md:py-18 lg:py-24"
          >
            {/* 1. DYNAMIC HEADER & PUNCHLINE */}
            <div
              ref={section2HeaderRef}
              className="w-full origin-top-left flex-shrink-0"
            >
              <JitterTextReveal
                as="h2"
                text={"Built for Fast Moving\nTeams That Need Control."}
                className="text-[32px] sm:text-[40px] md:text-[46px] lg:text-[52px] font-bold text-white tracking-[-0.03em] leading-[1.1] select-none"
                style={{ fontFamily: 'var(--font-heading)' }}
                stagger={18}
                duration={850}
              />

              <JitterTextReveal
                as="p"
                text="Turning complex operational data into automated BI dashboards, scalable ETL pipelines, and actionable decisions."
                className="text-white/60 text-[14px] sm:text-[15.5px] md:text-[16.5px] leading-relaxed max-w-3xl mt-3.5 sm:mt-4 md:mt-5 select-none"
                stagger={10}
                duration={700}
              />
            </div>

            {/* 2. THE 4 METRIC BOXES - Generous gap between cards & from header */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 md:gap-8 xl:gap-9 2xl:gap-10 mt-8 sm:mt-11 md:mt-14 lg:mt-16 xl:mt-20 items-stretch">
              {cards.map((card, idx) => (
                <BigMetricBox
                  key={card.id}
                  card={card}
                  index={idx}
                  showGraphs={showGraphs}
                  showNumbers={showNumbers}
                  onSelect={(c) => setSelectedCard(c)}
                />
              ))}
            </div>

            {/* 3. EXPERIENCE & WORK DESCRIPTION - Generous gap after cards */}
            <div
              className={`footprint-wrapper w-full mt-8 sm:mt-11 md:mt-14 lg:mt-16 xl:mt-18 select-none transition-all duration-700 ${
                showNumbers ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
            >
              <JitterTextReveal
                as="p"
                text="Over 3+ years architecting automated BI platforms, scalable cloud data pipelines, and decision-support systems for enterprise clients and cross-functional teams worldwide."
                className="text-white/65 text-[14px] sm:text-[15px] md:text-[16px] leading-[1.8] max-w-4xl font-normal select-none"
                trigger={showNumbers}
                stagger={8}
                duration={650}
              />
            </div>
          </div>
        </div>

        {/* ARCHITECTURAL SECTION DIVIDER (Matching Reference Image with Generous Spacing) */}
        <div className="w-full my-28 sm:my-36 md:my-44 pointer-events-none select-none">
          <div className="relative w-full h-px bg-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/30 -translate-y-1/2 bg-[#000000] px-1.5">+</span>
            <span className="text-[9px] font-mono text-white/25 tracking-[0.2em] uppercase hidden md:inline-block bg-[#000000] px-3">
              PRODUCTION STACK &bull; CORE ECOSYSTEM
            </span>
            <span className="text-[11px] font-mono text-white/30 -translate-y-1/2 bg-[#000000] px-1.5">+</span>
          </div>
        </div>

        {/* 4. SECTION 3, 3.5 & 4: PROFESSIONAL TOOLS, INTRO STATEMENT, AND PROJECTS */}
        <div
          id="third-section"
          className="tools-section-block w-full select-none"
        >
          <ToolsGridSection
            isProjectsIntroActive={isProjectsIntroActive}
            introKey={introKey}
          />
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
