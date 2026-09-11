import React from 'react';
import { PredictiveArcCanvas } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  return (
    <div className="shader-frame w-full h-[480px] sm:h-[580px] md:h-[680px] rounded-2xl md:rounded-3xl relative overflow-hidden bg-[#030308]">
      <PredictiveArcCanvas
        variant="data-pixel"
        mode="dark"
        speed={1.00}
        hue={0}
        saturation={1.00}
        brightness={1.00}
      />
    </div>
  );
}

export const FourthSection: React.FC = () => {
  return (
    <section
      id="fourth-section"
      className="relative z-10 w-full bg-[#000000] overflow-hidden pt-2 pb-16 sm:pb-24"
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <Scene />
      </div>
    </section>
  );
};

export default FourthSection;
