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
import monitorFrameSvg from '../../assets/monitor-halftone-frame.svg';
import { TextGenerateEffect } from './text-generate-effect';
import { JitterTextReveal } from './JitterTextReveal';

export interface ToolItem {
  id: string;
  name?: string;
  category?: string;
  src?: string;
}

interface ToolsGridSectionProps {
  tools?: ToolItem[];
  isProjectsIntroActive?: boolean;
  introKey?: number;
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
    className={`tool-box-card tool-interactive-card relative min-h-[155px] sm:min-h-[180px] md:min-h-[200px] flex items-center justify-center p-4 sm:p-5 border-r border-b border-white/[0.1] ${
      isHatched ? 'bg-[#040405]' : 'bg-[#070709] hover:bg-[#0c0c0f]'
    } transition-colors group ${className}`}
    style={isHatched ? hatchedStyle : undefined}
  >
    {tool?.src ? (
      <img
        src={tool.src}
        alt={tool.name || 'Tool'}
        className="tool-icon-img w-[75%] h-[75%] max-w-[125px] max-h-[125px] object-contain filter drop-shadow-[0_0_16px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-300 pointer-events-none"
      />
    ) : (
      <div className="flex flex-col items-center gap-2">
        <span className="text-white/15 text-[20px] font-mono leading-none">&times;</span>
        {tool?.name && (
          <span className="tool-name-text text-[10px] font-mono text-white/20 tracking-wider uppercase">
            {tool.name}
          </span>
        )}
      </div>
    )}
  </div>
);

export const ToolsGridSection: React.FC<ToolsGridSectionProps> = ({
  tools = defaultTools,
  isProjectsIntroActive = false,
  introKey = 0,
}) => {
  const loopIframeRef = React.useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);

  const monitorIframeRef = React.useRef<HTMLIFrameElement>(null);
  const monitorStageRef = React.useRef<HTMLDivElement>(null);
  const [stageScale, setStageScale] = React.useState(1);
  const [isMonitorPlaying, setIsMonitorPlaying] = React.useState(true);
  const [isMonitorMuted, setIsMonitorMuted] = React.useState(true);

  React.useEffect(() => {
    const el = monitorStageRef.current;
    if (!el) return;

    const updateScale = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        setStageScale(rect.width / 960);
      }
    };

    updateScale();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          setStageScale(width / 960);
        }
      }
    });
    ro.observe(el);

    window.addEventListener('resize', updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (loopIframeRef.current?.contentWindow) {
      const nextPlaying = !isPlaying;
      loopIframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: nextPlaying ? 'playVideo' : 'pauseVideo',
          args: '',
        }),
        '*'
      );
      setIsPlaying(nextPlaying);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (loopIframeRef.current?.contentWindow) {
      const nextMuted = !isMuted;
      loopIframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: nextMuted ? 'mute' : 'unMute',
          args: '',
        }),
        '*'
      );
      setIsMuted(nextMuted);
    }
  };

  const toggleMonitorPlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (monitorIframeRef.current?.contentWindow) {
      const nextPlaying = !isMonitorPlaying;
      monitorIframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: nextPlaying ? 'playVideo' : 'pauseVideo',
          args: '',
        }),
        '*'
      );
      setIsMonitorPlaying(nextPlaying);
    }
  };

  const toggleMonitorMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (monitorIframeRef.current?.contentWindow) {
      const nextMuted = !isMonitorMuted;
      monitorIframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: nextMuted ? 'mute' : 'unMute',
          args: '',
        }),
        '*'
      );
      setIsMonitorMuted(nextMuted);
    }
  };

  React.useEffect(() => {
    // Expose helpers for dynamic video swapping with YouTube IDs or URLs
    (window as any).setProjectVideo = (urlOrId: string) => {
      if (loopIframeRef.current) {
        const id = urlOrId.includes('youtu')
          ? urlOrId.split('/').pop()?.split('?')[0]
          : urlOrId;
        loopIframeRef.current.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`;
      }
    };
    (window as any).setProject2Video = (urlOrId: string) => {
      if (monitorIframeRef.current) {
        const id = urlOrId.includes('youtu')
          ? urlOrId.split('/').pop()?.split('?')[0]
          : urlOrId;
        monitorIframeRef.current.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`;
      }
    };
  }, []);

  // RANDOM CYBER GLITCH & STATUS BREATH GLOW ENGINE
  // Periodically triggers subtle glitch bursts or gentle breathing luminescence across random tool cards
  React.useEffect(() => {
    let timeoutId: number;
    let isCancelled = false;

    const scheduleRandomEffect = () => {
      // Pick random delay between 1.5s and 3.5s
      const delay = Math.random() * 2000 + 1500;

      timeoutId = window.setTimeout(() => {
        if (isCancelled) return;

        const allCards = Array.from(
          document.querySelectorAll('.tool-interactive-card')
        );

        if (allCards.length > 0) {
          // Select 1 to 2 random cards
          const count = Math.random() > 0.6 ? 2 : 1;
          const shuffled = allCards.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, count);

          selected.forEach((card) => {
            const el = card as HTMLElement;
            // Prevent clashing if already animating
            if (
              el.classList.contains('tool-glitch-active') ||
              el.classList.contains('tool-glow-active')
            ) {
              return;
            }

            // 55% chance for gentle glow & offing, 45% chance for quick cyber glitch
            const isGlow = Math.random() > 0.45;

            if (isGlow) {
              el.classList.add('tool-glow-active');
              window.setTimeout(() => {
                el.classList.remove('tool-glow-active');
              }, 2600);
            } else {
              el.classList.add('tool-glitch-active');
              window.setTimeout(() => {
                el.classList.remove('tool-glitch-active');
              }, 340);
            }
          });
        }

        scheduleRandomEffect();
      }, delay);
    };

    scheduleRandomEffect();

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-0 pb-16 flex flex-col">
      {/* 1. TOP ROW: Tool Stack Header on Left, 4×3 Bento Grid on Right */}
      <div
        id="third-section-content"
        className="w-full min-h-[85vh] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 xl:gap-20 will-change-transform py-12 sm:py-16"
      >
        {/* LEFT: Normal readable description text with signature entrance animation */}
        <div className="tools-left-content w-full lg:w-[38%] xl:w-[36%] flex flex-col justify-center text-left shrink-0 will-change-transform pt-2 select-text">
          <JitterTextReveal
            as="h2"
            text="Tool Stack"
            className="text-[38px] sm:text-[48px] md:text-[56px] xl:text-[64px] font-bold text-white tracking-[-0.035em] leading-[1.05] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
            stagger={25}
            duration={800}
          />

          <JitterTextReveal
            as="p"
            text="Every project is built on a carefully selected stack of enterprise-grade tools — from Power BI and SQL Server for analytics, to Snowflake and Azure for scalable cloud infrastructure. These are the technologies I rely on daily to deliver production-ready data solutions."
            className="text-[16px] sm:text-[18px] md:text-[20px] text-white/70 leading-[1.7] font-normal tracking-[-0.01em]"
            stagger={8}
            duration={650}
          />
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
                <div className="tool-box-card tool-interactive-card col-span-2 md:col-span-3 relative min-h-[155px] sm:min-h-[180px] md:min-h-[200px] flex items-center justify-center p-4 sm:p-6 md:p-8 border-r border-b border-white/[0.1] bg-[#070709] hover:bg-[#0c0c0f] transition-colors group overflow-hidden">
                  <img
                    src={scalableTextUrl}
                    alt="SCALABLE"
                    className="tool-icon-img w-[90%] max-w-[580px] h-[65%] object-contain filter drop-shadow-[0_0_24px_rgba(255,255,255,0.18)] group-hover:scale-[1.03] transition-transform duration-300 pointer-events-none"
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

      {/* ARCHITECTURAL SECTION DIVIDER (Generous Spacing) */}
      <div className="w-full my-28 sm:my-36 md:my-44 pointer-events-none select-none">
        <div className="relative w-full h-px bg-white/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-white/30 -translate-y-1/2 bg-[#000000] px-1.5">+</span>
          <span className="text-[9px] font-mono text-white/25 tracking-[0.2em] uppercase hidden md:inline-block bg-[#000000] px-3">
            ARCHITECTURAL STATEMENT &bull; BUILD FOR SCALE
          </span>
          <span className="text-[11px] font-mono text-white/30 -translate-y-1/2 bg-[#000000] px-1.5">+</span>
        </div>
      </div>

      {/* 2. SECTION 3.5: FULL-SCREEN JITTER TEXT REVEAL & SCROLL SCALE */}
      <div
        id="projects-intro-section"
        className="projects-intro-section w-full min-h-[85vh] sm:min-h-screen py-28 sm:py-36 my-6 flex items-center justify-center text-center px-6 sm:px-10 md:px-16 lg:px-20 xl:px-28 relative select-none will-change-transform"
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-45"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255, 255, 255, 0.08) 0%, rgba(16, 185, 129, 0.03) 40%, transparent 75%)',
          }}
        />

        {/* Grand Full-Screen Text matching exact user spec */}
        <div className="w-full max-w-[1640px] mx-auto py-6 sm:py-10 md:py-14">
          <JitterTextReveal
            key={introKey}
            text="These are the projects architect with precision and build for scale."
            trigger={isProjectsIntroActive}
            renderAsDots={true}
            enableScrollScale={true}
            stagger={28}
            className="text-[36px] sm:text-[50px] md:text-[66px] lg:text-[84px] xl:text-[98px] 2xl:text-[112px] font-bold text-white tracking-[-0.038em] leading-[1.08] text-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          />
        </div>
      </div>

      {/* ARCHITECTURAL SECTION DIVIDER (Generous Spacing) */}
      <div className="w-full my-28 sm:my-36 md:my-44 pointer-events-none select-none">
        <div className="relative w-full h-px bg-white/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-white/30 -translate-y-1/2 bg-[#000000] px-1.5">+</span>
          <span className="text-[9px] font-mono text-white/25 tracking-[0.2em] uppercase hidden md:inline-block bg-[#000000] px-3">
            FLAGSHIP ENTERPRISE SHOWCASE &bull; 04
          </span>
          <span className="text-[11px] font-mono text-white/30 -translate-y-1/2 bg-[#000000] px-1.5">+</span>
        </div>
      </div>

      {/* 3. SECTION 04: PROJECTS SECTION PLACEMENT
          - Left: Hands tablet scaled down slightly and shifted further left for balanced stage
          - Center: Tablet screen maximized with authentic high-end Loop Task Management System UI
          - Bottom: Hands anchor down to the bottom of the screen with wrists grounded
          - Right: Ultra-premium architectural project showcase card
      */}
      <div
        id="fourth-section"
        className="fourth-section-block w-full pt-10 sm:pt-16 pb-4 sm:pb-6 flex flex-col-reverse lg:flex-row items-center lg:items-end justify-between gap-6 lg:gap-8 xl:gap-10"
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
              <iframe
                ref={loopIframeRef}
                src="https://www.youtube-nocookie.com/embed/Q6wwLcIGRq4?autoplay=1&mute=1&loop=1&playlist=Q6wwLcIGRq4&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1"
                title="Loop Task Management System Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="absolute inset-0 w-full h-full border-0 select-none pointer-events-none scale-[1.25] origin-center"
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

            {/* Halftone Hands Tablet Frame Overlay (Anchored to bottom-left corner) with feather mask at bottom */}
            <img
              src={handsDeviceSvg}
              alt="Hands Holding Tablet"
              className="absolute inset-0 w-full h-full object-contain object-left-bottom pointer-events-none z-20 select-none filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]"
              style={{
                maskImage:
                  'linear-gradient(to bottom, #000000 0%, #000000 76%, rgba(0,0,0,0.7) 86%, rgba(0,0,0,0.2) 94%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, #000000 0%, #000000 76%, rgba(0,0,0,0.7) 86%, rgba(0,0,0,0.2) 94%, transparent 100%)',
              }}
            />

            {/* Seamless Black Overlay: Softly fades and dissolves the wrist endings into the black background */}
            <div
              className="absolute -inset-x-8 -bottom-1 h-[26%] sm:h-[28%] md:h-[30%] pointer-events-none z-30"
              style={{
                background:
                  'linear-gradient(to top, #000000 22%, rgba(0, 0, 0, 0.9) 55%, rgba(0, 0, 0, 0.35) 82%, transparent 100%)',
              }}
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
            <JitterTextReveal
              as="p"
              text="Architected an enterprise grade, multi tenant task and workforce management portal with a 4 tier RBAC system across 13 controllers and 12 route groups. Built a Stale While Revalidate caching engine processing 300,000+ biometric attendance logs, plus automated Excel JS / PDF Kit reporting pipelines with tamper proof daily work logs."
              className="text-[17px] sm:text-[18.5px] md:text-[20px] lg:text-[21px] text-white/75 leading-[1.85] sm:leading-[1.9] font-normal tracking-[-0.012em]"
              stagger={8}
              duration={650}
            />

            {/* Tools Used: Signature Grid-Type Manner with Ample Spacing */}
            <div className="pt-2 sm:pt-4">
              <div className="text-[11.5px] sm:text-[13px] font-mono text-white/45 uppercase tracking-widest mb-4 sm:mb-5 flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <JitterTextReveal
                  as="span"
                  text="Core Stack & Modules"
                  stagger={16}
                  duration={550}
                />
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
                      className={`tool-interactive-card relative min-h-[96px] sm:min-h-[110px] md:min-h-[118px] p-4 sm:p-5 md:p-5.5 flex flex-col justify-between border-r border-b border-white/[0.1] transition-colors group select-none ${
                        item.isHatched ? 'bg-[#040405]' : 'bg-[#070709] hover:bg-[#0c0c0f]'
                      }`}
                      style={item.isHatched ? hatchedStyle : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] sm:text-[10px] md:text-[10.5px] font-mono text-white/40 uppercase tracking-wider">
                          0{idx + 1} // {item.category}
                        </span>
                        <span className="tool-dot-indicator w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-emerald-400 transition-colors" />
                      </div>
                      <span className="tool-name-text text-[14.5px] sm:text-[16px] md:text-[17px] font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors pt-2">
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

      {/* ARCHITECTURAL SECTION DIVIDER (Generous Spacing between Project 1 and Project 2) */}
      <div className="w-full my-14 sm:my-18 md:my-22 pointer-events-none select-none">
        <div className="relative w-full h-px bg-white/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-white/30 -translate-y-1/2 bg-[#000000] px-1.5">+</span>
          <span className="text-[9px] font-mono text-white/25 tracking-[0.2em] uppercase hidden md:inline-block bg-[#000000] px-3">
            PROJECT 02 // TECHNICAL HUB &bull; 10-YEAR ANALYTICS
          </span>
          <span className="text-[11px] font-mono text-white/30 -translate-y-1/2 bg-[#000000] px-1.5">+</span>
        </div>
      </div>

      {/* 5. SECTION 05: SECOND PROJECT SECTION PLACEMENT
          - Left: Same structure as Project 1 (Dotted Title, Description, Core Stack & Modules Grid) - positioned on left edge end-to-end with decent padding
          - Right: Halftone Monitor with Perspective Screen Video & Interactive Controls
      */}
      <div
        id="fifth-section"
        className="fifth-section-block w-screen relative left-1/2 -translate-x-1/2 max-w-[1920px] px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 pt-4 sm:pt-6 pb-16 sm:pb-20 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 xl:gap-12 overflow-hidden"
      >
        {/* LEFT: Project Details (Dotted Title, Description, Core Stack & Modules moved more to the left edge) */}
        <div className="w-full lg:w-[44%] xl:w-[42%] 2xl:w-[40%] flex flex-col justify-start text-left pt-2 sm:pt-4 pb-4 shrink-0 select-text self-center lg:self-start">
          {/* Title - Halftone Dotted Title matching Project 1 structure (1 line or max 2 lines) */}
          <div
            className="fifth-section-title mb-8 sm:mb-10 lg:mb-14 xl:mb-16"
            role="heading"
            aria-level={3}
            aria-label="Technical Hub - 10-Year Analytics Dashboard"
          >
            <JitterTextReveal
              as="h3"
              text={"Technical Hub -\n10-Year Analytics Dashboard"}
              renderAsDots={true}
              nowrapLines={true}
              className="text-[26px] sm:text-[32px] md:text-[38px] lg:text-[40px] xl:text-[46px] 2xl:text-[50px] font-bold text-white tracking-[-0.035em] leading-[1.12]"
              stagger={16}
              duration={700}
            />
          </div>

          {/* Description with Generous Spacing & Signature Tools Grid matching Project 1 */}
          <div className="fifth-section-desc space-y-8 sm:space-y-10 lg:space-y-12">
            <JitterTextReveal
              as="p"
              text="Built a comprehensive 10-year analytics dashboard for Technical Hub, transforming years of scattered organizational data into a single, interactive source of truth. Consolidated historical data across programs, certifications, placements, staff growth, power consumption, websites, applications, and key organizational metrics."
              className="text-[17px] sm:text-[18.5px] md:text-[19.5px] lg:text-[20px] xl:text-[20.5px] text-white/75 leading-[1.85] sm:leading-[1.9] font-normal tracking-[-0.012em] max-w-[760px] xl:max-w-[840px] 2xl:max-w-[920px]"
              stagger={8}
              duration={650}
            />

            {/* Tools Used: Signature Grid-Type Manner with Ample Spacing matching Project 1 */}
            <div className="pt-2 sm:pt-4">
              <div className="text-[11.5px] sm:text-[13px] font-mono text-white/45 uppercase tracking-widest mb-4 sm:mb-5 flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <JitterTextReveal
                  as="span"
                  text="Core Stack & Modules"
                  stagger={16}
                  duration={550}
                />
              </div>

              <div className="relative w-full border border-white/15 bg-[#030304] overflow-hidden">
                {/* 3×2 Bento Grid for the 6 Core Project Tools */}
                <div className="grid grid-cols-2 sm:grid-cols-3">
                  {[
                    { name: 'Data Analytics', category: 'Historical ETL', isHatched: false },
                    { name: 'Data Visualization', category: 'Interactive BI', isHatched: true },
                    { name: 'HTML', category: 'Semantic DOM', isHatched: false },
                    { name: 'CSS', category: 'Responsive UI', isHatched: true },
                    { name: 'JavaScript', category: 'Dynamic Engine', isHatched: false },
                    { name: 'Vercel', category: 'Cloud Infrastructure', isHatched: true },
                  ].map((item, idx) => (
                    <div
                      key={item.name}
                      className={`tool-interactive-card relative min-h-[96px] sm:min-h-[110px] md:min-h-[118px] p-4 sm:p-5 md:p-5.5 flex flex-col justify-between border-r border-b border-white/[0.1] transition-colors group select-none ${
                        item.isHatched ? 'bg-[#040405]' : 'bg-[#070709] hover:bg-[#0c0c0f]'
                      }`}
                      style={item.isHatched ? hatchedStyle : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] sm:text-[10px] md:text-[10.5px] font-mono text-white/40 uppercase tracking-wider">
                          0{idx + 1} // {item.category}
                        </span>
                        <span className="tool-dot-indicator w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-emerald-400 transition-colors" />
                      </div>
                      <span className="tool-name-text text-[14.5px] sm:text-[16px] md:text-[17px] font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors pt-2">
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

        {/* RIGHT: Halftone Monitor with 3D Perspective-Tilted Video Screen (Shifted a little bit right) */}
        <div className="fifth-section-monitor w-full lg:w-[55%] xl:w-[56%] 2xl:w-[57%] flex items-center justify-center lg:justify-end shrink-0 select-none overflow-visible lg:translate-x-4 xl:translate-x-8 2xl:translate-x-12">
          <div
            ref={monitorStageRef}
            className="relative w-full max-w-[1020px] lg:max-w-[1240px] xl:max-w-[1440px] 2xl:max-w-[1600px] aspect-[960/532] flex items-center justify-center overflow-hidden"
          >
            {/* Scaled Coordinate Space Canvas (960 x 532) strictly synchronized with the SVG coordinate system */}
            <div
              className="absolute top-0 left-0 w-[960px] h-[532px] pointer-events-auto origin-top-left"
              style={{
                transform: `scale(${stageScale})`,
                transformOrigin: 'top left',
              }}
            >
              {/* Perspective Screen Container - Masked with sleek thin-bezel quadrilateral */}
              <div
                className="absolute inset-0 z-10 overflow-hidden group cursor-pointer"
                style={{
                  clipPath: 'polygon(23.70% 22.80%, 77.30% 3.80%, 75.50% 62.80%, 19.40% 82.20%)',
                  WebkitClipPath: 'polygon(23.70% 22.80%, 77.30% 3.80%, 75.50% 62.80%, 19.40% 82.20%)',
                }}
                onClick={() => toggleMonitorPlay()}
              >
                {/* 3D Perspective Tilted Video from YouTube:
                    Transformed by projective matrix3d mapping standard 1000x625 (16:10) desktop screen
                    to the exact tilted 3D plane and foreshortened quad with a thin sleek right bezel */}
                <iframe
                  ref={monitorIframeRef}
                  id="projectVideo"
                  src="https://www.youtube-nocookie.com/embed/zWx6pSXDvbA?autoplay=1&mute=1&loop=1&playlist=zWx6pSXDvbA&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1"
                  title="Technical Hub - 10-Year Analytics Dashboard"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="absolute top-0 left-0 w-[1000px] h-[625px] border-0 bg-black select-none pointer-events-none"
                  style={{
                    transformOrigin: '0 0',
                    transform: 'matrix3d(0.508655046, -0.101240865, 0, -0.000007957, -0.079403224, 0.474253839, 0, -0.000071710, 0, 0, 1, 0, 227.520000, 121.296000, 0, 1)',
                  }}
                />

                {/* Subtle Realistic 3D Glass Screen Reflection Glare */}
                <div
                  className="absolute top-0 left-0 w-[1000px] h-[625px] pointer-events-none"
                  style={{
                    transformOrigin: '0 0',
                    transform: 'matrix3d(0.508655046, -0.101240865, 0, -0.000007957, -0.079403224, 0.474253839, 0, -0.000071710, 0, 0, 1, 0, 227.520000, 121.296000, 0, 1)',
                    background: 'linear-gradient(125deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 28%, transparent 55%, rgba(0,0,0,0.2) 100%)',
                  }}
                />

                {/* Floating Controls Overlay on Hover */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-12 right-24 z-30 flex items-center gap-1.5 pointer-events-auto">
                    <button
                      type="button"
                      onClick={toggleMonitorPlay}
                      className="px-2.5 py-1.5 rounded bg-black/85 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors text-[9px] sm:text-[10px] font-mono flex items-center gap-1.5 shadow-xl cursor-pointer"
                      title={isMonitorPlaying ? 'Pause video' : 'Play video'}
                    >
                      <span>{isMonitorPlaying ? '⏸' : '▶'}</span>
                      <span>{isMonitorPlaying ? 'PAUSE' : 'PLAY'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={toggleMonitorMute}
                      className="px-2.5 py-1.5 rounded bg-black/85 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors text-[9px] sm:text-[10px] font-mono flex items-center gap-1.5 shadow-xl cursor-pointer"
                      title={isMonitorMuted ? 'Unmute video' : 'Mute video'}
                    >
                      <span>{isMonitorMuted ? '🔇' : '🔊'}</span>
                      <span>{isMonitorMuted ? 'MUTED' : 'SOUND'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Halftone Monitor Dot Art Frame Overlay (Sits directly on top of the 960x532 coordinate space) */}
              <img
                src={monitorFrameSvg}
                alt="Project Monitor Halftone Frame"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 select-none filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
