import React from 'react';

interface NavbarProps {
  hidden?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ hidden = false }) => {
  return (
    <header
      className={`fixed top-0 left-0 w-full z-20 px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center transition-all duration-500 ease-out ${
        hidden
          ? 'opacity-0 -translate-y-6 pointer-events-none'
          : 'opacity-100 translate-y-0 pointer-events-auto'
      }`}
    >
      {/* Logo (left) */}
      <div className="flex items-center gap-3">
        <span
          className="text-[21px] sm:text-[26px] tracking-tight text-black select-none"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Anala Abhilash®
        </span>
        <span
          className="text-[25px] sm:text-[30px] text-black select-none leading-none inline-block"
          style={{ letterSpacing: '-0.02em' }}
          aria-hidden="true"
        >
          ✳︎
        </span>
      </div>

      {/* Right CTA */}
      <div>
        <a
          href="mailto:analaabhilashabhi@gmail.com"
          className="text-[18px] sm:text-[22px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity tracking-tight"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
};
