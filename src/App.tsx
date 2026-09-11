import React, { useState } from 'react';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioSection } from './components/PortfolioSection';
import { Footer } from './components/Footer';

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

      {/* Section 2 & 3: GSAP Parallax Entry, Staggered Boxes, and Tool Stack */}
      <PortfolioSection
        onScrollProgress={(progress) => setIsScrolledPastHero(progress > 0.05)}
      />

      {/* Footer: End-to-end screen emerald pixel horizon aura */}
      <Footer />
    </main>
  );
};

export default App;
