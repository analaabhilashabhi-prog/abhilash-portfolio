import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTypewriter } from '../hooks/useTypewriter';

gsap.registerPlugin(ScrollTrigger);

export interface HeroProps {
  onExplore?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const typewriterText =
    'Building automated Power BI dashboards and reporting solutions that drive smarter, faster decisions.';
  const { displayed, done } = useTypewriter(typewriterText, 34, 600);

  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPillsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // GSAP Parallax scroll exit
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current && sectionRef.current) {
        gsap.to(contentRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
          y: -180,
          opacity: 0,
          scale: 0.92,
          filter: 'blur(8px)',
          ease: 'none',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('analaabhilashabhi@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const handleScrollToSection = () => {
    if (onExplore) {
      onExplore();
    } else {
      const element = document.getElementById('portfolio-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full min-h-screen flex flex-col justify-end pb-16 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 pointer-events-none select-none"
      style={{ backgroundColor: 'transparent' }}
    >
      <div
        ref={contentRef}
        className="max-w-xl relative z-10 pointer-events-auto will-change-transform"
      >
        {/* 1. Blurred intro label */}
        <div
          className="pointer-events-none select-none mb-5 sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.3,
            fontWeight: 400,
            color: '#000',
            filter: 'blur(4px)',
          }}
        >
          Hey there, meet Anala Abhilash,
          <br />
          Data Analyst | Power Platform Developer
        </div>

        {/* 2. Typewriter text */}
        <p
          className="text-black mb-5 sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.35,
            fontWeight: 400,
            minHeight: '54px',
          }}
        >
          {displayed}
          {!done && (
            <span
              className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink"
              aria-hidden="true"
            />
          )}
        </p>

        {/* 3. Action pill navigation buttons */}
        <div
          className="flex flex-wrap gap-y-1 transition-all duration-400"
          style={{
            opacity: pillsVisible ? 1 : 0,
            transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          {/* Capabilities navigation pill */}
          <button
            type="button"
            onClick={handleScrollToSection}
            className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer shadow-sm group"
          >
            <span>Capabilities</span>
            <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-[11px]">
              &darr;
            </span>
          </button>

          {/* Workflows navigation pill */}
          <button
            type="button"
            onClick={handleScrollToSection}
            className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer shadow-sm group"
          >
            <span>Workflows</span>
            <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-[11px]">
              &darr;
            </span>
          </button>

          {/* Outline pill button with Email copy */}
          <button
            type="button"
            onClick={handleCopyEmail}
            title="Click to copy email address"
            className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer gap-2 sm:gap-3 group"
          >
            <span>
              Reach me:{' '}
              <span className="underline underline-offset-1">
                {copied ? 'copied to clipboard!' : 'analaabhilashabhi@gmail.com'}
              </span>
            </span>
            {/* 12x12 copy icon SVG */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block shrink-0"
              aria-hidden="true"
            >
              <rect
                x="3.5"
                y="1.5"
                width="7"
                height="7"
                rx="0.8"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
              />
              <path
                d="M1.5 3.5V9.5C1.5 10.0523 1.94772 10.5 2.5 10.5H8.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
