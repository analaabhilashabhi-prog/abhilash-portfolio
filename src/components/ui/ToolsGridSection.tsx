import React from 'react';
import logo1Url from '../../assets/logos/logo-dotted-color.svg';
import logo2Url from '../../assets/logos/logo-dotted-2.svg';
import logo3Url from '../../assets/logos/logo-dotted-3.svg';
import logo4Url from '../../assets/logos/logo-dotted-4.svg';
import logo5Url from '../../assets/logos/logo-dotted-5.svg';
import logo6Url from '../../assets/logos/logo-dotted-6.svg';
import logo7Url from '../../assets/logos/logo-dotted-7.svg';
import logo8Url from '../../assets/logos/logo-dotted-8.svg';
import logo9Url from '../../assets/logos/logo-dotted-9.svg';
import scalableTextUrl from '../../assets/logos/text-scalable.svg';
import handsDeviceSvg from '../../assets/hands-device-frame.svg';

export interface ToolItem {
  id: string;
  name?: string;
  category?: string;
  src?: string;
}

interface ToolsGridSectionProps {
  tools?: ToolItem[];
}

// 9 tool slots + 1 wide combined banner slot for SCALABLE
const defaultTools: ToolItem[] = [
  { id: 'tool-1', name: 'Power BI', src: logo1Url },
  { id: 'tool-2', name: 'Tool 2', src: logo2Url },
  { id: 'tool-3', name: 'Snowflake', src: logo3Url },
  { id: 'tool-4', name: 'Tool 4', src: logo4Url },
  { id: 'tool-5', name: 'Power Automate', src: logo5Url },
  { id: 'tool-6', name: 'Tool 6', src: logo6Url },
  { id: 'tool-7', name: 'Copilot', src: logo7Url },
  { id: 'tool-8', name: 'Python', src: logo8Url },
  { id: 'tool-9', name: 'Fabric', src: logo9Url },
];

const hatchedStyle: React.CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.04) 0, rgba(255, 255, 255, 0.04) 1px, transparent 0, transparent 9px)',
};

const ToolBox: React.FC<{ tool?: ToolItem; isHatched?: boolean; className?: string }> = ({
  tool,
  isHatched = false,
  className = '',
}) => (
  <div
    className={`tool-box-card relative min-h-[155px] sm:min-h-[180px] md:min-h-[200px] flex items-center justify-center p-4 sm:p-5 border-r border-b border-white/[0.1] ${
      isHatched ? 'bg-[#040405]' : 'bg-[#070709] hover:bg-[#0c0c0f]'
    } transition-colors group ${className}`}
    style={isHatched ? hatchedStyle : undefined}
  >
    {tool?.src ? (
      <img
        src={tool.src}
        alt={tool.name || 'Tool'}
        className="w-[75%] h-[75%] max-w-[125px] max-h-[125px] object-contain filter drop-shadow-[0_0_16px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-300 pointer-events-none"
      />
    ) : (
      <div className="flex flex-col items-center gap-2">
        <span className="text-white/15 text-[20px] font-mono leading-none">&times;</span>
        {tool?.name && (
          <span className="text-[10px] font-mono text-white/20 tracking-wider uppercase">
            {tool.name}
          </span>
        )}
      </div>
    )}
  </div>
);

export const ToolsGridSection: React.FC<ToolsGridSectionProps> = ({
  tools = defaultTools,
}) => {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-0 pb-16 flex flex-col">
      {/* 1. TOP ROW: Tool Stack Header on Left, 4×3 Bento Grid on Right */}
      <div
        id="third-section-content"
        className="w-full flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-14 xl:gap-20 will-change-transform"
      >
        {/* LEFT: Normal readable description text */}
        <div className="tools-left-content w-full lg:w-[38%] xl:w-[36%] flex flex-col justify-start text-left shrink-0 will-change-transform pt-2 select-text">
          <h2
            className="text-[38px] sm:text-[48px] md:text-[56px] xl:text-[64px] font-bold text-white tracking-[-0.035em] leading-[1.05] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Tool Stack
          </h2>

          <p className="text-[16px] sm:text-[18px] md:text-[20px] text-white/70 leading-[1.7] font-normal tracking-[-0.01em]">
            Every project is built on a carefully selected stack of{' '}
            <span className="text-white font-medium">enterprise-grade tools</span> — from{' '}
            <span className="text-white font-medium">Power BI</span> and{' '}
            <span className="text-white font-medium">SQL Server</span> for analytics, to{' '}
            <span className="text-white font-medium">Snowflake</span> and{' '}
            <span className="text-white font-medium">Azure</span> for scalable cloud
            infrastructure. These are the technologies I rely on daily to deliver{' '}
            <span className="text-white font-medium">production-ready</span> data solutions.
          </p>
        </div>

        {/* RIGHT: 4×3 Bento Grid (12 boxes) */}
        <div className="tools-right-stack w-full lg:w-[62%] xl:w-[64%] flex flex-col items-stretch lg:items-end will-change-transform">
          <div className="relative w-full">
            {/* Corner Blueprint Accents */}
            <div
              className="absolute -top-3 -right-3 w-6 h-6 border border-white/20 hidden sm:block pointer-events-none"
              style={hatchedStyle}
            />
            <div
              className="absolute -bottom-3 -left-3 w-6 h-6 border border-white/20 hidden sm:block pointer-events-none"
              style={hatchedStyle}
            />

            {/* Outer Blueprint Lines */}
            <div className="absolute -top-3 left-0 right-0 h-px bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-3 left-0 right-0 h-px bg-white/10 pointer-events-none" />
            <div className="absolute -left-3 top-0 bottom-0 w-px bg-white/10 pointer-events-none" />
            <div className="absolute -right-3 top-0 bottom-0 w-px bg-white/10 pointer-events-none" />

            {/* THE 4×3 GRID */}
            <div className="relative w-full border border-white/15 bg-[#030304] overflow-hidden">
              {/* Row 1 */}
              <div className="grid grid-cols-2 md:grid-cols-4">
                <ToolBox tool={tools[0]} />
                <ToolBox tool={tools[1]} isHatched />
                <ToolBox tool={tools[2]} />
                <ToolBox tool={tools[3]} isHatched />
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-2 md:grid-cols-4">
                <ToolBox tool={tools[4]} isHatched />
                <ToolBox tool={tools[5]} />
                <ToolBox tool={tools[6]} isHatched />
                <ToolBox tool={tools[7]} />
              </div>
              {/* Row 3 */}
              <div className="grid grid-cols-2 md:grid-cols-4">
                <ToolBox tool={tools[8]} className="col-span-2 md:col-span-1" />
                <div className="tool-box-card col-span-2 md:col-span-3 relative min-h-[155px] sm:min-h-[180px] md:min-h-[200px] flex items-center justify-center p-4 sm:p-6 md:p-8 border-r border-b border-white/[0.1] bg-[#070709] hover:bg-[#0c0c0f] transition-colors group overflow-hidden">
                  <img
                    src={scalableTextUrl}
                    alt="SCALABLE"
                    className="w-[90%] max-w-[580px] h-[65%] object-contain filter drop-shadow-[0_0_24px_rgba(255,255,255,0.18)] group-hover:scale-[1.03] transition-transform duration-300 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Corner Intersection Rings */}
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full border border-white/40 bg-black pointer-events-none" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-white/40 bg-black pointer-events-none" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full border border-white/40 bg-black pointer-events-none" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-white/40 bg-black pointer-events-none" />
            {/* Mid-edge rings */}
            <span className="hidden md:block absolute -top-1 left-1/4 w-2 h-2 rounded-full border border-white/30 bg-black -translate-x-1/2 pointer-events-none" />
            <span className="hidden md:block absolute -top-1 left-1/2 w-2 h-2 rounded-full border border-white/30 bg-black -translate-x-1/2 pointer-events-none" />
            <span className="hidden md:block absolute -top-1 left-3/4 w-2 h-2 rounded-full border border-white/30 bg-black -translate-x-1/2 pointer-events-none" />
            <span className="hidden md:block absolute -bottom-1 left-1/4 w-2 h-2 rounded-full border border-white/30 bg-black -translate-x-1/2 pointer-events-none" />
            <span className="hidden md:block absolute -bottom-1 left-1/2 w-2 h-2 rounded-full border border-white/30 bg-black -translate-x-1/2 pointer-events-none" />
            <span className="hidden md:block absolute -bottom-1 left-3/4 w-2 h-2 rounded-full border border-white/30 bg-black -translate-x-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. SECTION 04: PROJECTS SECTION PLACEMENT
          - Left: Hands tablet pushed to the far left corner with negative margin and enlarged
          - Center: Tablet screen maximized for 16:9 project demos, screenshots, and presentations
          - Bottom: Hands anchor down to the bottom of the screen so they don't hover mid-air
          - Right: Aligned with the cloud logo column for clean project typography & metadata
      */}
      <div
        id="fourth-section"
        className="w-full mt-[100vh] pt-2 flex flex-col-reverse lg:flex-row items-end justify-between gap-6 lg:gap-8 xl:gap-12"
      >
        {/* LEFT: Hands Tablet Artwork - Left-aligned, balanced scale & anchored to bottom */}
        <div className="fourth-section-hands w-[calc(100%+1.5rem)] sm:w-[calc(100%+2rem)] lg:w-[70%] xl:w-[72%] -ml-6 sm:-ml-10 md:-ml-12 lg:-ml-16 xl:-ml-20 -translate-x-2 sm:-translate-x-4 lg:-translate-x-6 flex items-end justify-start self-end overflow-visible">
          <div className="relative w-full max-w-[980px] lg:max-w-[1080px] aspect-[960/729] flex items-end justify-start">
            {/* Screen Content Layer (inside the tablet frame cutout: 20.58% left, 10.28% top, 60.48% width, 54.64% height) */}
            <div
              className="absolute z-10 overflow-hidden bg-[#050508] border border-white/10 rounded-[6px] sm:rounded-[10px] md:rounded-[14px] flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.95)]"
              style={{
                left: '20.58%',
                top: '10.28%',
                width: '60.48%',
                height: '54.64%',
              }}
            >
              {/* Screen Top Header: Sleek Browser / Presentation Bar */}
              <div className="w-full h-6 sm:h-8 md:h-9 bg-[#0e0e13] border-b border-white/10 px-2 sm:px-3.5 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#ff5f56]" />
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#ffbd2e]" />
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#27c93f]" />
                  <div className="ml-1.5 sm:ml-2.5 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center gap-1.5 text-[8.5px] sm:text-[10px] font-mono text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>project://16:9-showcase.mp4</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block text-[8.5px] font-mono text-white/30 uppercase tracking-widest">
                    1080P • 60FPS
                  </span>
                  <div className="flex items-center gap-1 text-[8px] sm:text-[9.5px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE DEMO
                  </div>
                </div>
              </div>

              {/* 16:9 Display Canvas (Maximized for project videos, recordings & screenshots) */}
              <div className="relative w-full flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-between bg-gradient-to-b from-[#0b0b10] via-[#050508] to-[#020204] overflow-hidden">
                {/* Ambient Screen Grid Texture */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Main 16:9 Presentation Stage */}
                <div className="relative z-10 flex flex-col justify-between h-full">
                  {/* Top Badge & Project Category */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[8.5px] sm:text-[10px] font-mono text-emerald-300 font-medium tracking-wide">
                        FEATURED SYSTEM
                      </span>
                      <span className="text-[9px] sm:text-[11px] font-mono text-white/40">
                        Enterprise Power BI & Pipeline
                      </span>
                    </div>
                    <span className="text-[8.5px] sm:text-[10px] font-mono text-white/40">
                      16:9 ASPECT READY
                    </span>
                  </div>

                  {/* Center Hero Showcase Title & Content */}
                  <div className="my-auto py-1 sm:py-2 space-y-1 sm:space-y-1.5">
                    <h4
                      className="text-[14px] sm:text-[19px] md:text-[23px] lg:text-[26px] font-bold text-white tracking-tight leading-snug"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Automated Operational Intelligence Platform
                    </h4>
                    <p className="text-[10px] sm:text-[12px] md:text-[13px] text-white/70 max-w-lg leading-relaxed">
                      End-to-end telemetry ingestion, sub-second query pipelines, and real-time executive dashboarding with row-level security.
                    </p>
                  </div>

                  {/* Bottom Control / Status Bar */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[8px] sm:text-[10px] font-mono">
                    <div className="flex items-center gap-2.5 text-white/50">
                      <span>• DAX Studio</span>
                      <span>• Power Query</span>
                      <span>• Snowflake</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>16:9 MEDIA CANVAS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Halftone Hands Tablet Frame Overlay (Anchored to bottom-left corner) */}
            <img
              src={handsDeviceSvg}
              alt="Hands Holding Tablet"
              className="absolute inset-0 w-full h-full object-contain object-left-bottom pointer-events-none z-20 select-none filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]"
            />
          </div>
        </div>

        {/* RIGHT: After the cloud logo column - Clean Title & Project Details */}
        <div className="w-full lg:w-[28%] xl:w-[26%] flex flex-col items-start justify-start text-left pb-4 lg:pb-8 shrink-0">
          <div className="fourth-section-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] sm:text-[12px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              04 // PROJECTS
            </span>
          </div>

          <h3
            className="fourth-section-title text-[36px] sm:text-[46px] md:text-[54px] lg:text-[60px] font-bold text-white tracking-[-0.035em] leading-[1.05]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Projects
          </h3>

          <p className="fourth-section-desc mt-4 text-[13px] sm:text-[14px] text-white/60 leading-relaxed font-normal">
            Handheld interactive showcase of enterprise BI dashboards, ETL data pipelines, and analytics automation engineered for decision makers.
          </p>
        </div>
      </div>
    </div>
  );
};
