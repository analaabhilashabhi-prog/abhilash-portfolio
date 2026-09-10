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
import descHalftoneUrl from '../../assets/logos/text-toolstack-desc.svg';

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
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-0 pb-12 flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-14 xl:gap-20 select-none">
      {/* LEFT: Heading + Halftone Dot-matrix Animated Description */}
      <div className="tools-left-content w-full lg:w-[40%] xl:w-[38%] flex flex-col justify-start text-left shrink-0 will-change-transform pt-2">
        <h2
          className="text-[38px] sm:text-[48px] md:text-[56px] xl:text-[64px] font-bold text-white tracking-[-0.035em] leading-[1.05] mb-6"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Tool Stack
        </h2>

        <div className="w-full max-w-[560px]">
          <img
            src={descHalftoneUrl}
            alt="Every project is built on a carefully selected stack of enterprise-grade tools — from Power BI and SQL Server for analytics, to Snowflake and Azure for scalable cloud infrastructure. These are the technologies I rely on daily to deliver production-ready data solutions."
            className="w-full h-auto block filter drop-shadow-[0_0_16px_rgba(255,255,255,0.12)] select-none pointer-events-none"
          />
        </div>
      </div>

      {/* RIGHT: 4×3 Bento Grid (12 boxes) */}
      <div className="tools-right-stack w-full lg:w-[60%] xl:w-[62%] flex flex-col items-stretch lg:items-end will-change-transform">
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
  );
};
