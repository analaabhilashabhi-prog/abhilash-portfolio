import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioSection } from './components/PortfolioSection';
import { Footer } from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    // Sublevel Studio inspired smooth momentum scrolling engine
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

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
