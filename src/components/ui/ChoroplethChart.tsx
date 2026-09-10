import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  worldCountryFeatures,
  worldGraticulePath,
  worldOutlinePath,
  certificationHubs,
  type WorldCountryFeature,
  type CertificationHub,
} from './worldMapData';

interface ChoroplethContextType {
  features: WorldCountryFeature[];
  hubs: CertificationHub[];
  activeStep: number;
  isAnimated: boolean;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  viewWidth: number;
  viewHeight: number;
}

const ChoroplethContext = createContext<ChoroplethContextType | null>(null);

function useChoropleth() {
  const context = useContext(ChoroplethContext);
  if (!context) {
    throw new Error('Choropleth subcomponents must be used inside <ChoroplethChart>');
  }
  return context;
}

/* -------------------------------------------------------------------------- */
/*                               ChoroplethChart                              */
/* -------------------------------------------------------------------------- */

export interface ChoroplethChartProps {
  className?: string;
  triggerAnimation?: boolean;
  loop?: boolean;
  children?: ReactNode;
}

export const ChoroplethChart: React.FC<ChoroplethChartProps> = ({
  className = '',
  triggerAnimation = true,
  loop = true,
  children,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const viewWidth = 340;
  const viewHeight = 180;

  // Continuous looping animation: Americas -> Europe -> Asia/APAC -> Full hold -> Retract -> Loop
  useEffect(() => {
    if (!triggerAnimation) {
      setIsAnimated(false);
      setActiveStep(0);
      return;
    }

    if (!loop) {
      const timer = setTimeout(() => {
        setIsAnimated(true);
        setActiveStep(3);
      }, 100);
      return () => clearTimeout(timer);
    }

    let isMounted = true;
    let stepTimer: ReturnType<typeof setTimeout>;
    let loopTimer: ReturnType<typeof setTimeout>;

    const runLoop = () => {
      if (!isMounted) return;
      setIsAnimated(true);

      // 1. Americas light up
      setActiveStep(1);

      stepTimer = setTimeout(() => {
        if (!isMounted) return;
        // 2. Europe lights up
        setActiveStep(2);

        stepTimer = setTimeout(() => {
          if (!isMounted) return;
          // 3. Asia & Australia light up
          setActiveStep(3);

          // Hold peak global illuminated state for 2.2 seconds
          loopTimer = setTimeout(() => {
            if (!isMounted) return;
            setIsAnimated(false);
            setActiveStep(0);

            // Wait 650ms for smooth retract, then repeat
            loopTimer = setTimeout(() => {
              if (!isMounted) return;
              runLoop();
            }, 650);
          }, 2200);
        }, 550);
      }, 550);
    };

    const initialTimer = setTimeout(runLoop, 150);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      clearTimeout(stepTimer);
      clearTimeout(loopTimer);
    };
  }, [triggerAnimation, loop]);

  return (
    <ChoroplethContext.Provider
      value={{
        features: worldCountryFeatures,
        hubs: certificationHubs,
        activeStep,
        isAnimated,
        hoveredId,
        setHoveredId,
        viewWidth,
        viewHeight,
      }}
    >
      <div className={`relative w-full h-full select-none ${className}`}>
        {children}
      </div>
    </ChoroplethContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                            ChoroplethGraticule                             */
/* -------------------------------------------------------------------------- */

export interface ChoroplethGraticuleProps {
  stroke?: string;
  strokeWidth?: number;
}

export const ChoroplethGraticule: React.FC<ChoroplethGraticuleProps> = ({
  stroke = 'rgba(255, 255, 255, 0.07)',
  strokeWidth = 0.6,
}) => {
  const { viewWidth, viewHeight } = useChoropleth();

  return (
    <g className="choropleth-graticule pointer-events-none">
      {/* Real Geographic Graticule lines (30-degree meridians and parallels) */}
      <path
        d={worldGraticulePath}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray="2 3"
      />

      {/* Global Boundary Outline */}
      <path
        d={worldOutlinePath}
        fill="none"
        stroke="rgba(255, 255, 255, 0.05)"
        strokeWidth={0.7}
      />

      {/* Subtle outer bounding border */}
      <rect
        x={6}
        y={6}
        width={viewWidth - 12}
        height={viewHeight - 12}
        rx={12}
        fill="none"
        stroke="rgba(255, 255, 255, 0.05)"
        strokeWidth={1}
      />
    </g>
  );
};

/* -------------------------------------------------------------------------- */
/*                         ChoroplethFeatureComponent                         */
/* -------------------------------------------------------------------------- */

export interface ChoroplethFeatureComponentProps {
  stroke?: string;
  strokeWidth?: number;
}

export const ChoroplethFeatureComponent: React.FC<ChoroplethFeatureComponentProps> = ({
  stroke = 'rgba(255, 255, 255, 0.1)',
  strokeWidth = 0.5,
}) => {
  const { features, hubs, activeStep, isAnimated, hoveredId, setHoveredId } = useChoropleth();

  return (
    <g className="choropleth-features">
      {/* 176 Real World Countries */}
      {features.map((country, idx) => {
        const isCertified = country.isCertified;

        // Same color combo:
        // Base landmasses: Deep charcoal (#202025)
        // Certified regions: Progressively illuminate in lighter slate grey (#545460 / #646473)
        const isRegionLit =
          isAnimated &&
          isCertified &&
          ((activeStep >= 1 && (country.id === '840' || country.id === '124')) || // USA & Canada
            (activeStep >= 2 && (country.id === '826' || country.id === '372' || country.id === '276')) || // UK, IRL, DEU
            (activeStep >= 3 && (country.id === '356' || country.id === '392' || country.id === '036'))); // India, Japan, Australia

        const fill = isRegionLit
          ? '#545460'
          : isCertified
          ? '#303038'
          : '#1e1e23';

        const strokeColor = isRegionLit
          ? 'rgba(255, 255, 255, 0.32)'
          : stroke;

        const isDimmed = hoveredId !== null && hoveredId !== country.id;

        return (
          <path
            key={`${country.id}-${idx}`}
            d={country.d}
            fill={fill}
            stroke={strokeColor}
            strokeWidth={isRegionLit ? 0.75 : strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={isDimmed ? 0.55 : 1}
            onMouseEnter={() => setHoveredId(country.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              transitionProperty: 'fill, stroke, opacity',
              transitionDuration: isAnimated ? '0.65s, 0.65s, 0.25s' : '0.4s, 0.4s, 0.2s',
              transitionTimingFunction: 'cubic-bezier(0.85, 0, 0.15, 1)',
              transitionDelay: isAnimated ? `${(idx % 4) * 0.05}s` : '0s',
            }}
          />
        );
      })}

      {/* 5 Global Certification Hub Beacons with continuous looped ripples */}
      {hubs.map((hub, hubIdx) => {
        const isHubActive =
          isAnimated &&
          ((hubIdx === 0 && activeStep >= 1) ||
            (hubIdx === 1 && activeStep >= 2) ||
            (hubIdx >= 2 && activeStep >= 3));

        return (
          <g key={hub.id} className="pointer-events-none">
            {/* Pulsing Beacon Ripple Ring */}
            <circle
              cx={hub.cx}
              cy={hub.cy}
              r={isHubActive ? 9 : 2.5}
              fill="none"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="0.85"
              opacity={isHubActive ? 0 : 0.85}
              style={{
                transitionProperty: 'r, opacity',
                transitionDuration: isAnimated ? '1.1s, 1.1s' : '0.4s, 0.4s',
                transitionTimingFunction: 'cubic-bezier(0.15, 0.85, 0.35, 1)',
                transitionDelay: isAnimated ? `${hubIdx * 0.12}s` : '0s',
              }}
            />

            {/* Glowing Hub Center Dot */}
            <circle
              cx={hub.cx}
              cy={hub.cy}
              r={isHubActive ? 2.5 : 1.8}
              fill={isHubActive ? '#ffffff' : '#888898'}
              style={{
                transitionProperty: 'fill, r',
                transitionDuration: '0.4s, 0.4s',
                transitionTimingFunction: 'ease-out',
              }}
            />
          </g>
        );
      })}
    </g>
  );
};

/* -------------------------------------------------------------------------- */
/*                              ChoroplethTooltip                             */
/* -------------------------------------------------------------------------- */

// Pure visual requirement: zero callout values or tooltips
export const ChoroplethTooltip: React.FC = () => {
  return null;
};

/* -------------------------------------------------------------------------- */
/*               MetricChoroplethCard: Card Component Container               */
/* -------------------------------------------------------------------------- */

export const MetricChoroplethCard: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-3">
      {/* Pure Map Chart: Real geographic world atlas, no callout values, continuous looped animation */}
      <div className="relative w-full h-[170px] sm:h-[185px] md:h-[195px] flex items-center justify-center">
        <ChoroplethChart
          triggerAnimation={isVisible}
          loop={true}
          className="w-full h-full flex items-center justify-center"
        >
          <svg
            viewBox="0 0 340 180"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Real Geographic Graticule Coordinate Lines */}
            <ChoroplethGraticule />

            {/* 176 Real World Countries with Two-Grey Color Combo and Looped Animation */}
            <ChoroplethFeatureComponent />

            {/* Tooltip included for API specification, renders nothing */}
            <ChoroplethTooltip />
          </svg>
        </ChoroplethChart>
      </div>
    </div>
  );
};
