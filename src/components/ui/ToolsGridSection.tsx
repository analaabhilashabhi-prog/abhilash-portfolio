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
import projectTitleSvg from '../../assets/logos/project-title-dotted.svg';
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
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

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
          - Left: Hands tablet scaled down slightly and shifted further left for balanced stage
          - Center: Tablet screen maximized with authentic high-end Loop Task Management System UI
          - Bottom: Hands anchor down to the bottom of the screen with wrists grounded
          - Right: Ultra-premium architectural project showcase card
      */}
      <div
        id="fourth-section"
        className="w-full mt-[100vh] min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-4rem)] pt-2 flex flex-col-reverse lg:flex-row items-end justify-between gap-6 lg:gap-8 xl:gap-10 pb-2 sm:pb-3 lg:pb-4"
      >
        {/* LEFT: Hands Tablet Artwork - Shifted a bit left side */}
        <div className="fourth-section-hands w-full lg:w-[58%] xl:w-[57%] -ml-10 sm:-ml-16 lg:-ml-22 xl:-ml-28 flex items-end justify-start self-end overflow-visible shrink-0">
          <div className="relative w-full max-w-[760px] lg:max-w-[830px] xl:max-w-[880px] aspect-[960/729] flex items-end justify-start translate-y-0">
            {/* Screen Content Layer - Full Video filling the entire tablet screen (20.58% left, 10.28% top, 60.48% width, 54.64% height) */}
            <div
              className="absolute z-10 overflow-hidden bg-black border border-white/15 rounded-[6px] sm:rounded-[10px] md:rounded-[14px] shadow-[0_0_70px_rgba(0,0,0,0.95)] group cursor-pointer"
              style={{
                left: '20.58%',
                top: '10.28%',
                width: '60.48%',
                height: '54.64%',
              }}
              onClick={() => togglePlay()}
            >
              <video
                ref={videoRef}
                src="/final-video.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover select-none"
              />

              {/* Subtle dark gradient overlay at bottom for controls visibility */}
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Floating Controls Overlay (Pause/Play & Mute/Unmute on hover) */}
              <div className="absolute bottom-2 sm:bottom-2.5 right-2 sm:right-2.5 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-2 py-1 rounded bg-black/75 backdrop-blur-md border border-white/20 text-white hover:bg-white/15 transition-colors text-[8px] sm:text-[9.5px] font-mono flex items-center gap-1 shadow-lg cursor-pointer"
                  title={isPlaying ? 'Pause video' : 'Play video'}
                >
                  <span>{isPlaying ? '⏸' : '▶'}</span>
                  <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="px-2 py-1 rounded bg-black/75 backdrop-blur-md border border-white/20 text-white hover:bg-white/15 transition-colors text-[8px] sm:text-[9.5px] font-mono flex items-center gap-1 shadow-lg cursor-pointer"
                  title={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  <span>{isMuted ? '🔇' : '🔊'}</span>
                  <span>{isMuted ? 'MUTED' : 'SOUND'}</span>
                </button>
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

        {/* RIGHT: Top-Aligned Minimal Typography with Signature Tool Grid - Shifted a bit right */}
        <div className="w-full lg:w-[46%] xl:w-[46%] flex flex-col justify-start text-left pt-2 sm:pt-4 lg:pt-6 pb-8 lg:pl-6 xl:pl-8 lg:translate-x-2 xl:translate-x-4 shrink-0 select-text self-start">
          {/* Title - Halftone Dotted Graphic - Much bigger with generous margin */}
          <div
            className="fourth-section-title mb-8 sm:mb-10 lg:mb-14 xl:mb-16 -ml-8 sm:-ml-16 lg:-ml-28 xl:-ml-36"
            role="heading"
            aria-level={3}
            aria-label="Loop Task Management System"
          >
            <img
              src={projectTitleSvg}
              alt="Loop Task Management System"
              className="w-full max-w-[600px] sm:max-w-[720px] md:max-w-[840px] lg:max-w-[960px] xl:max-w-[1080px] h-auto object-contain filter drop-shadow-[0_0_28px_rgba(255,255,255,0.2)] pointer-events-none select-none"
            />
          </div>

          {/* Description with Generous Spacing & Signature Tools Grid */}
          <div className="fourth-section-desc space-y-8 sm:space-y-10 lg:space-y-12">
            <p className="text-[17px] sm:text-[18.5px] md:text-[20px] lg:text-[21px] text-white/75 leading-[1.85] sm:leading-[1.9] font-normal tracking-[-0.012em]">
              Architected an enterprise grade, multi tenant task and workforce management portal with a{' '}
              <span className="text-white font-medium">4 tier RBAC system</span> across 13 controllers and 12 route groups. Built a{' '}
              <span className="text-white font-medium">Stale While Revalidate caching engine</span> processing{' '}
              <span className="text-white font-medium">300,000+ biometric attendance logs</span>, plus automated{' '}
              <span className="text-white font-medium">Excel JS / PDF Kit</span> reporting pipelines with{' '}
              <span className="text-white font-medium">tamper proof daily work logs</span>.
            </p>

            {/* Tools Used: Signature Grid-Type Manner with Ample Spacing */}
            <div className="pt-2 sm:pt-4">
              <div className="text-[11.5px] sm:text-[13px] font-mono text-white/45 uppercase tracking-widest mb-4 sm:mb-5 flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Core Stack & Modules</span>
              </div>

              <div className="relative w-full border border-white/15 bg-[#030304] overflow-hidden">
                {/* 3×2 Bento Grid for the 6 Core Project Tools - Generous padding & cell heights */}
                <div className="grid grid-cols-2 sm:grid-cols-3">
                  {[
                    { name: 'Claude Code', category: 'AI & Synthesis', isHatched: false },
                    { name: 'Antigravity', category: 'Agentic Core', isHatched: true },
                    { name: 'RBAC', category: '4-Tier Security', isHatched: false },
                    { name: 'Caching Engine', category: 'SWR Architecture', isHatched: true },
                    { name: 'Excel JS', category: 'Report Pipeline', isHatched: false },
                    { name: 'PDF Kit', category: 'Tamper-Proof Audit', isHatched: true },
                  ].map((item, idx) => (
                    <div
                      key={item.name}
                      className={`relative min-h-[96px] sm:min-h-[110px] md:min-h-[118px] p-4 sm:p-5 md:p-5.5 flex flex-col justify-between border-r border-b border-white/[0.1] transition-colors group select-none ${
                        item.isHatched ? 'bg-[#040405]' : 'bg-[#070709] hover:bg-[#0c0c0f]'
                      }`}
                      style={item.isHatched ? hatchedStyle : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] sm:text-[10px] md:text-[10.5px] font-mono text-white/40 uppercase tracking-wider">
                          0{idx + 1} // {item.category}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-emerald-400 transition-colors" />
                      </div>
                      <span className="text-[14.5px] sm:text-[16px] md:text-[17px] font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors pt-2">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Corner Intersection Rings */}
                <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full border border-white/40 bg-black pointer-events-none" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-white/40 bg-black pointer-events-none" />
                <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full border border-white/40 bg-black pointer-events-none" />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-white/40 bg-black pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
