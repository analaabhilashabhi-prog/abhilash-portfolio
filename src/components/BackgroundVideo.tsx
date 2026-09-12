import React, { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 97;
const SENSITIVITY = 0.8;
const LERP_FACTOR = 0.18; // Butter-smooth damping factor

interface BackgroundVideoProps {
  hidden?: boolean;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ hidden = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const prevXRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload frames in background
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/frames/f_${numStr}.webp`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) {
          setIsLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // Butter-smooth render loop using requestAnimationFrame + LERP (paused when hidden to maximize scroll FPS)
  useEffect(() => {
    if (hidden) return;
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      const images = imagesRef.current;

      if (canvas && images.length > 0) {
        // Butter smooth lerp interpolation
        const diff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(diff) > 0.001) {
          currentFrameRef.current += diff * LERP_FACTOR;
        } else {
          currentFrameRef.current = targetFrameRef.current;
        }

        const frameIndex = Math.max(
          0,
          Math.min(FRAME_COUNT - 1, Math.round(currentFrameRef.current))
        );
        const img = images[frameIndex];

        if (img && img.complete && img.naturalWidth > 0) {
          const ctx = canvas.getContext('2d', { alpha: false });
          if (ctx) {
            const cw = canvas.width;
            const ch = canvas.height;
            const iw = img.naturalWidth;
            const ih = img.naturalHeight;

            // object-fit: cover with object-position: 70% center
            const scale = Math.max(cw / iw, ch / ih);
            const sw = iw * scale;
            const sh = ih * scale;
            const x = (cw - sw) * 0.7;
            const y = (ch - sh) * 0.5;

            ctx.drawImage(img, x, y, sw, sh);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [hidden]);

  // Resize canvas to match display window
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Mouse & Touch Scrubbing with Sensitivity Calculation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      const frameDelta = (delta / window.innerWidth) * SENSITIVITY * (FRAME_COUNT - 1);
      targetFrameRef.current = Math.max(
        0,
        Math.min(FRAME_COUNT - 1, targetFrameRef.current + frameDelta)
      );
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const clientX = e.touches[0].clientX;
      if (prevXRef.current === null) {
        prevXRef.current = clientX;
        return;
      }

      const delta = clientX - prevXRef.current;
      prevXRef.current = clientX;

      const frameDelta = (delta / window.innerWidth) * SENSITIVITY * (FRAME_COUNT - 1);
      targetFrameRef.current = Math.max(
        0,
        Math.min(FRAME_COUNT - 1, targetFrameRef.current + frameDelta)
      );
    };

    const handleTouchEnd = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-0 w-full h-full pointer-events-none select-none overflow-hidden transition-opacity duration-500 ${
        hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#a6a3a4' }}
    >
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded && !hidden ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
