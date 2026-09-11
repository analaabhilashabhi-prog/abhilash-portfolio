import React, { useState } from 'react';
import { PredictiveArcCanvas } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('analaabhilashabhi@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <footer className="relative z-10 w-full bg-[#000000] text-white overflow-hidden select-none border-t border-white/10">
      {/* 1. END-TO-END SCREEN EMERALD PIXEL HORIZON AURA */}
      <div className="w-full relative overflow-hidden bg-[#030308]">
        <div className="shader-frame w-full h-[320px] sm:h-[400px] md:h-[480px] lg:h-[540px] relative overflow-hidden bg-[#030308]">
          <PredictiveArcCanvas
            variant="data-pixel"
            mode="dark"
            speed={1.00}
            hue={0}
            saturation={1.00}
            brightness={1.00}
          />
        </div>

        {/* Ambient Top & Bottom Edge Vignette for Seamless Pure Black Blending */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#000000] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#000000] via-[#000000]/70 to-transparent pointer-events-none" />

        {/* Floating Call to Action overlay directly over the horizon center */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 sm:pb-12 px-4 text-center pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center gap-4 max-w-xl">
            <h3
              className="text-[26px] sm:text-[34px] md:text-[42px] font-bold text-white tracking-[-0.03em] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Let's Build Something Meaningful.
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
              <a
                href="mailto:analaabhilashabhi@gmail.com"
                className="inline-flex items-center gap-2 bg-white text-black font-medium text-[13px] sm:text-[14px] px-5 py-2.5 rounded-full hover:bg-emerald-400 hover:text-black transition-colors duration-200 shadow-lg cursor-pointer"
              >
                <span>Get in Touch</span>
                <span>&rarr;</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono text-[12px] sm:text-[13px] px-4 py-2.5 rounded-full border border-white/15 transition-colors duration-200 cursor-pointer backdrop-blur-sm"
              >
                <span>{copied ? 'Copied to clipboard!' : 'analaabhilashabhi@gmail.com'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MINIMAL BOTTOM BAR */}
      <div className="w-full max-w-[1600px] mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40 border-t border-white/[0.08]">
        <p className="select-text">
          &copy; {new Date().getFullYear()} Anala Abhilash &bull; Data Analyst | Power Platform Developer
        </p>

        <div className="flex items-center gap-4 text-white/50">
          <span className="flex items-center gap-1.5 text-emerald-400/90">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Horizon Active</span>
          </span>
          <span>&bull;</span>
          <span>Hyderabad, India</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
