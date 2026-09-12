import React, { useEffect, useMemo, useRef, useState } from 'react';

// Tunable constants matching user specification
export const JITTER_CONFIG = {
  duration: 1000, // 1000ms per letter for fluid, responsive entrance
  stagger: 28, // 28ms added delay per letter in forward reading order
  letterStartScale: 2, // scale(2) [200%]
  letterEndScale: 1, // scale(1) [100%]
  letterStartBlur: 20, // filter blur(20px)
  letterEndBlur: 0, // filter blur(0px)
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)', // strong ease-out / slow down curve
  scrollScaleStart: 1.1, // 110%
  scrollScaleEnd: 0.85, // 85%
  observerThreshold: 0.3,
  observerRootMargin: '0px 0px -10% 0px',
};

interface GlyphData {
  width: number;
  height: number;
  circles: { cx: number; cy: number; r: number; fill: string }[];
}

// Global glyph cache for instantaneous rendering
const glyphCache = new Map<string, GlyphData>();

function generateDottedGlyph(char: string): GlyphData {
  if (glyphCache.has(char)) {
    return glyphCache.get(char)!;
  }

  // Handle space
  if (char === ' ') {
    const spaceData: GlyphData = { width: 34, height: 110, circles: [] };
    glyphCache.set(char, spaceData);
    return spaceData;
  }

  if (typeof document === 'undefined') {
    return { width: 40, height: 110, circles: [] };
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return { width: 40, height: 110, circles: [] };
  }

  const fontSize = 100;
  // Bold architectural sans-serif font matching titles & scalable dot art
  ctx.font = `900 ${fontSize}px "HelveticaNowDisplay-Medium", "Helvetica Neue", -apple-system, BlinkMacSystemFont, Arial, sans-serif`;

  const metrics = ctx.measureText(char);
  const textWidth = Math.ceil(metrics.width);
  const canvasWidth = Math.max(80, textWidth + 40);
  const canvasHeight = 130;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.font = `900 ${fontSize}px "HelveticaNowDisplay-Medium", "Helvetica Neue", -apple-system, BlinkMacSystemFont, Arial, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'alphabetic';

  const startX = 20;
  const baselineY = 92;
  ctx.fillText(char, startX, baselineY);

  const imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const data = imgData.data;

  const pitch = 4.4; // 4.4px dot pitch
  const maxR = 2.0;  // 2.0px max radius (diameter 4.0px with 0.4px dot separation)

  const rawCircles: { cx: number; cy: number; r: number; alpha: number }[] = [];
  let minX = Infinity;
  let maxX = -Infinity;

  // Fixed vertical coordinate space so all glyphs align to common baseline
  const fixedMinY = 12;
  const fixedMaxY = 122;
  const fixedHeight = fixedMaxY - fixedMinY; // 110px

  for (let y = pitch / 2; y < canvasHeight; y += pitch) {
    for (let x = pitch / 2; x < canvasWidth; x += pitch) {
      let sumAlpha = 0;
      let samples = 0;
      const rx = Math.round(x);
      const ry = Math.round(y);

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const px = rx + dx;
          const py = ry + dy;
          if (px >= 0 && px < canvasWidth && py >= 0 && py < canvasHeight) {
            const idx = (py * canvasWidth + px) * 4;
            sumAlpha += data[idx + 3];
            samples++;
          }
        }
      }

      const coverage = sumAlpha / (samples * 255);
      if (coverage > 0.08) {
        const r = Math.max(0.85, Math.min(maxR, coverage * maxR * 1.15));
        rawCircles.push({ cx: x, cy: y, r, alpha: coverage });

        if (x - r < minX) minX = x - r;
        if (x + r > maxX) maxX = x + r;
      }
    }
  }

  if (rawCircles.length === 0) {
    const emptyData: GlyphData = { width: Math.max(20, textWidth), height: fixedHeight, circles: [] };
    glyphCache.set(char, emptyData);
    return emptyData;
  }

  const pad = 2;
  const boxWidth = Math.max(10, maxX - minX + pad * 2);

  const circles = rawCircles.map((c) => {
    // Halftone gradient matching project-title-dotted.svg & text-scalable.svg
    const lightness = Math.round(225 + c.alpha * 30);
    return {
      cx: parseFloat((c.cx - minX + pad).toFixed(1)),
      cy: parseFloat((c.cy - fixedMinY).toFixed(1)),
      r: parseFloat(c.r.toFixed(2)),
      fill: `rgb(${lightness}, ${lightness}, ${lightness})`,
    };
  });

  const glyphData: GlyphData = {
    width: Math.round(boxWidth),
    height: fixedHeight,
    circles,
  };

  glyphCache.set(char, glyphData);
  return glyphData;
}

const DottedGlyph: React.FC<{ char: string }> = ({ char }) => {
  const glyph = useMemo(() => generateDottedGlyph(char), [char]);

  if (glyph.circles.length === 0) {
    return (
      <span
        className="inline-block"
        style={{
          width: `${(glyph.width / glyph.height) * 1.08}em`,
          height: '1.08em',
        }}
      />
    );
  }

  return (
    <svg
      viewBox={`0 0 ${glyph.width} ${glyph.height}`}
      className="inline-block overflow-visible select-none filter drop-shadow-[0_0_18px_rgba(255,255,255,0.25)]"
      style={{
        height: '1.08em',
        width: `${(glyph.width / glyph.height) * 1.08}em`,
        verticalAlign: '-0.20em',
      }}
      aria-hidden="true"
    >
      {glyph.circles.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={c.fill} />
      ))}
    </svg>
  );
};

export interface JitterTextRevealProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  trigger?: boolean;
  renderAsDots?: boolean;
  enableScrollScale?: boolean;
  stagger?: number;
  duration?: number;
  startScale?: number;
  startBlur?: number;
  nowrapLines?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div' | 'span';
}

export const JitterTextReveal: React.FC<JitterTextRevealProps> = ({
  text,
  className = '',
  style,
  trigger,
  renderAsDots = false,
  enableScrollScale = false,
  nowrapLines = false,
  stagger,
  duration = 900,
  startScale = 2,
  startBlur = 20,
  as: Component = 'div',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollScale, setScrollScale] = useState(JITTER_CONFIG.scrollScaleStart);
  const [isEntered, setIsEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [, setFontReloadTick] = useState(0);

  // Re-render when web fonts finish loading so glyphs use the custom font
  useEffect(() => {
    if (renderAsDots && typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        glyphCache.clear();
        setFontReloadTick((t) => t + 1);
      });
    }
  }, [renderAsDots]);

  // 1. Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
      setIsEntered(true);
    }
    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) setIsEntered(true);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 2. Replay animation EVERY time user enters section (bidirectional: up and down)
  useEffect(() => {
    if (typeof trigger === 'boolean') {
      if (trigger) {
        const timer = setTimeout(() => {
          setIsEntered(true);
        }, 40);
        return () => clearTimeout(timer);
      } else {
        setIsEntered(false);
      }
    }
  }, [trigger]);

  // Fallback IntersectionObserver when trigger is not externally controlled
  useEffect(() => {
    if (typeof trigger === 'boolean') return;
    const element = containerRef.current;
    if (!element) return;

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsEntered(true);
            } else {
              setIsEntered(false);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -10% 0px',
        }
      );

      observer.observe(element);
      return () => observer.disconnect();
    }
  }, [trigger]);

  // 3. Continuous scroll-linked scale (only if enableScrollScale is true)
  useEffect(() => {
    if (!enableScrollScale) return;
    let rafId: number;

    const calculateScale = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      const elementCenter = rect.top + rect.height / 2;
      const progress = Math.max(0, Math.min(1, (vh - elementCenter) / vh));

      const currentScale =
        JITTER_CONFIG.scrollScaleStart -
        progress * (JITTER_CONFIG.scrollScaleStart - JITTER_CONFIG.scrollScaleEnd);

      setScrollScale(currentScale);
    };

    const handleScrollOrResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(calculateScale);
    };

    calculateScale();

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [enableScrollScale]);

  // Split text by newlines into lines, then words, then letters with continuous index
  const linesData = useMemo(() => {
    const lines = text.split('\n');
    let globalIndex = 0;
    return lines.map((line) => {
      const words = line.split(' ');
      return words.map((word) => {
        const letters = word.split('').map((char) => ({
          char,
          index: globalIndex++,
        }));
        return letters;
      });
    });
  }, [text]);

  const effectiveStagger =
    stagger ?? (renderAsDots ? JITTER_CONFIG.stagger : 14);

  const content = (
    <span aria-hidden="true" className="inline-block w-full">
      {linesData.map((words, lineIdx) => (
        <span
          key={lineIdx}
          className={`${linesData.length > 1 ? 'block' : 'inline'} ${
            nowrapLines ? 'whitespace-nowrap' : ''
          }`}
        >
          {words.map((wordLetters, wordIdx) => (
            <span
              key={wordIdx}
              className="inline-block whitespace-nowrap mr-[0.28em]"
            >
              {wordLetters.map(({ char, index }) => {
                const delay = reducedMotion ? 0 : index * effectiveStagger;

                return (
                  <span
                    key={index}
                    className="inline-block transform-gpu"
                    style={{
                      opacity: isEntered ? 1 : 0,
                      transform: isEntered
                        ? `scale(1)`
                        : `scale(${startScale})`,
                      filter: isEntered
                        ? `blur(0px)`
                        : `blur(${startBlur}px)`,
                      transitionProperty: isEntered
                        ? 'opacity, transform, filter'
                        : 'none',
                      transitionDuration: isEntered
                        ? (reducedMotion ? '0ms' : `${duration}ms`)
                        : '0ms',
                      transitionTimingFunction: JITTER_CONFIG.easing,
                      transitionDelay: isEntered ? `${delay}ms` : '0ms',
                    }}
                  >
                    {renderAsDots ? <DottedGlyph char={char} /> : char}
                  </span>
                );
              })}
            </span>
          ))}
        </span>
      ))}
    </span>
  );

  return (
    <Component
      ref={containerRef as any}
      className={`relative select-none ${className}`}
      style={style}
      aria-label={text}
    >
      {enableScrollScale ? (
        <div
          className="w-full will-change-transform transform-gpu origin-center"
          style={{
            transform: `scale(${scrollScale.toFixed(4)})`,
          }}
        >
          {content}
        </div>
      ) : (
        content
      )}
    </Component>
  );
};

export default JitterTextReveal;
