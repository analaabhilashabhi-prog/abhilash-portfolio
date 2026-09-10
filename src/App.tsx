import React, { useState } from 'react';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioSection } from './components/PortfolioSection';

export const App: React.FC = () => {
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  return (
    <main
      className="relative min-h-screen w-full text-black"
      style={{ backgroundColor: '#a6a3a4' }}
    >
      {/* Full-screen butter-smooth frame scrubber (completely hidden when scrolled past Hero) */}
      <BackgroundVideo hidden={isScrolledPastHero} />

      {/* Top Navbar with auto-hide as second screen enters */}
      <Navbar hidden={isScrolledPastHero} />

      {/* Hero Section with GSAP Parallax Scroll Exit */}
      <Hero />

      {/* Section 2 & 3: GSAP Parallax Entry, Staggered Boxes, and End-to-End Rectangle */}
      <PortfolioSection
        onScrollProgress={(progress) => setIsScrolledPastHero(progress > 0.05)}
      />

      {/* Minimal Footer: Seamless pure black end-to-end */}
      <footer
        className="relative z-10 py-8 px-5 text-center text-[13px] text-white/50"
        style={{ backgroundColor: '#000000' }}
      >
        <p>&copy; {new Date().getFullYear()} Anala Abhilash &bull; Data Analyst | Power Platform Developer</p>
      </footer>
    </main>
  );
};

export default App;
