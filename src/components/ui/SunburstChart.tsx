import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';

export interface SunburstNode {
  name: string;
  value?: number;
  color?: string;
  fill?: string;
  children?: SunburstNode[];
}

export interface SunburstArc {
  id: string;
  arcIndex: number;
  depth: number;
  name: string;
  value: number;
  startAngle: number;
  endAngle: number;
  rIn: number;
  rOut: number;
  parentIndex: number;
  color?: string;
}

interface SunburstContextType {
  arcs: SunburstArc[];
  activeStep: number;
  isAnimated: boolean;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  size: number;
  center: { cx: number; cy: number };
}

const SunburstContext = createContext<SunburstContextType | null>(null);

function useSunburst() {
  const context = useContext(SunburstContext);
  if (!context) {
    throw new Error('Sunburst subcomponents must be used inside <SunburstChart>');
  }
  return context;
}

/* -------------------------------------------------------------------------- */
/*                                Arc Builder                                 */
/* -------------------------------------------------------------------------- */

// Generate concentric radial arcs with padding
function buildArcs(data: SunburstNode, size = 240): { arcs: SunburstArc[]; maxDepth: number } {
  const arcs: SunburstArc[] = [];
  let idCounter = 0;

  function sumValues(node: SunburstNode): number {
    if (!node.children || node.children.length === 0) return node.value || 1;
    node.value = node.children.reduce((acc, c) => acc + sumValues(c), 0);
    return node.value;
  }
  sumValues(data);

  const scale = size / 240;

  // Concentric radial bands matching specified canvas size
  const ringRadii = [
    { rIn: 0, rOut: 23 * scale },             // Center Hub
    { rIn: 27 * scale, rOut: 51 * scale },    // Depth 1: Core Domains
    { rIn: 55 * scale, rOut: 79 * scale },    // Depth 2: Architecture Layers
    { rIn: 83 * scale, rOut: 107 * scale },   // Depth 3: Production Solutions
  ];

  function traverse(
    node: SunburstNode,
    depth: number,
    startAngle: number,
    endAngle: number,
    parentIndex: number
  ) {
    if (depth > 0) {
      const arcIndex = arcs.length;
      arcs.push({
        id: `arc-${idCounter++}-${depth}`,
        arcIndex,
        depth,
        name: node.name,
        value: node.value || 1,
        startAngle,
        endAngle,
        rIn: ringRadii[depth]?.rIn || 83,
        rOut: ringRadii[depth]?.rOut || 107,
        parentIndex,
        color: node.color,
      });
    }

    if (node.children && depth < 3) {
      let currentAngle = startAngle;
      const angleSpan = endAngle - startAngle;
      const parentVal = node.value || 1;

      node.children.forEach((child) => {
        const childVal = child.value || 1;
        const childSpan = (childVal / parentVal) * angleSpan;
        traverse(child, depth + 1, currentAngle, currentAngle + childSpan, arcs.length - 1);
        currentAngle += childSpan;
      });
    }
  }

  // Start from 12 o'clock (-Math.PI / 2) through full 360 degrees
  traverse(data, 0, -Math.PI / 2, (3 * Math.PI) / 2, -1);

  return { arcs, maxDepth: 3 };
}

// Helper to convert polar coordinates to SVG annular sector path
function describeArc(
  cx: number,
  cy: number,
  rIn: number,
  rOut: number,
  startAngle: number,
  endAngle: number,
  gapAngle = 0.024
): string {
  const a0 = startAngle + gapAngle;
  const a1 = endAngle - gapAngle;
  if (a1 <= a0) return '';

  const x1 = (cx + rOut * Math.cos(a0)).toFixed(2);
  const y1 = (cy + rOut * Math.sin(a0)).toFixed(2);
  const x2 = (cx + rOut * Math.cos(a1)).toFixed(2);
  const y2 = (cy + rOut * Math.sin(a1)).toFixed(2);
  const x3 = (cx + rIn * Math.cos(a1)).toFixed(2);
  const y3 = (cy + rIn * Math.sin(a1)).toFixed(2);
  const x4 = (cx + rIn * Math.cos(a0)).toFixed(2);
  const y4 = (cy + rIn * Math.sin(a0)).toFixed(2);

  const largeArc = a1 - a0 > Math.PI ? 1 : 0;

  return `M ${x1} ${y1} A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 ${largeArc} 0 ${x4} ${y4} Z`;
}

/* -------------------------------------------------------------------------- */
/*                               SunburstChart                                */
/* -------------------------------------------------------------------------- */

export interface SunburstChartProps {
  data: SunburstNode;
  size?: number;
  className?: string;
  triggerAnimation?: boolean;
  loop?: boolean;
  children?: ReactNode;
}

export const SunburstChart: React.FC<SunburstChartProps> = ({
  data,
  size = 240,
  className = '',
  triggerAnimation = true,
  loop = true,
  children,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const { arcs } = useMemo(() => buildArcs(data, size), [data, size]);
  const center = { cx: size / 2, cy: size / 2 };

  // Looped animation: Ring 1 -> Ring 2 -> Ring 3 -> Full hold -> Retract -> Loop
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

      // 1. Inner core reveals
      setActiveStep(1);

      stepTimer = setTimeout(() => {
        if (!isMounted) return;
        // 2. Middle architecture ring expands
        setActiveStep(2);

        stepTimer = setTimeout(() => {
          if (!isMounted) return;
          // 3. Outer solution leaf ring radiates
          setActiveStep(3);

          // Hold peak illuminated state for 2.2 seconds
          loopTimer = setTimeout(() => {
            if (!isMounted) return;
            setIsAnimated(false);
            setActiveStep(0);

            // Wait 600ms for smooth retract, then repeat
            loopTimer = setTimeout(() => {
              if (!isMounted) return;
              runLoop();
            }, 600);
          }, 2200);
        }, 500);
      }, 500);
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
    <SunburstContext.Provider
      value={{
        arcs,
        activeStep,
        isAnimated,
        hoveredIndex,
        setHoveredIndex,
        size,
        center,
      }}
    >
      <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
        {children}
      </div>
    </SunburstContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                               SunburstSegment                              */
/* -------------------------------------------------------------------------- */

export interface SunburstSegmentProps {
  index: number;
  color?: string;
  fill?: string;
}

export const SunburstSegment: React.FC<SunburstSegmentProps> = ({ index }) => {
  const { arcs, activeStep, isAnimated, hoveredIndex, setHoveredIndex, center } = useSunburst();
  const arc = arcs[index];
  if (!arc) return null;

  const isDepthActive = activeStep >= arc.depth;
  const isSegmentLit = isAnimated && isDepthActive;

  // Same color combo: Two grey tones (#2b2b31 base dark charcoal, #545460 lighter slate grey)
  let baseFill = '#222227';
  let litFill = '#34343d';

  if (arc.depth === 1) {
    baseFill = '#26262d';
    litFill = '#3e3e49';
  } else if (arc.depth === 2) {
    baseFill = '#2b2b33';
    litFill = arc.arcIndex % 2 === 0 ? '#545460' : '#454552';
  } else {
    // Depth 3: Outer leaves with rhythmic alternating slate grey and charcoal
    baseFill = '#232328';
    litFill = arc.arcIndex % 3 === 0 ? '#545460' : arc.arcIndex % 3 === 1 ? '#484856' : '#3c3c46';
  }

  const currentFill = isSegmentLit ? litFill : baseFill;
  const isHovered = hoveredIndex === index;
  const isDimmed = hoveredIndex !== null && !isHovered;

  // Hover pop out
  const hoverRadialOffset = isHovered ? 2.5 : 0;
  const rIn = isSegmentLit ? arc.rIn + hoverRadialOffset : arc.rIn * 0.4;
  const rOut = isSegmentLit ? arc.rOut + hoverRadialOffset : arc.rIn * 0.4 + 2;

  const pathD = describeArc(center.cx, center.cy, rIn, rOut, arc.startAngle, arc.endAngle);

  return (
    <path
      d={pathD}
      fill={currentFill}
      stroke={isSegmentLit ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.06)'}
      strokeWidth={isSegmentLit ? 0.75 : 0.5}
      opacity={isDimmed ? 0.4 : isSegmentLit ? 1 : 0.25}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      style={{
        transitionProperty: 'all',
        transitionDuration: isAnimated ? '0.7s' : '0.45s',
        transitionTimingFunction: 'cubic-bezier(0.85, 0, 0.15, 1)',
        transitionDelay: isAnimated ? `${(arc.depth - 1) * 0.15 + (index % 5) * 0.03}s` : '0s',
      }}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                               SunburstCenter                               */
/* -------------------------------------------------------------------------- */

export const SunburstCenter: React.FC<{ className?: string }> = () => {
  const { center, isAnimated } = useSunburst();

  return (
    <g className="sunburst-center pointer-events-none">
      {/* Outer center ring */}
      <circle
        cx={center.cx}
        cy={center.cy}
        r={23}
        fill="#121215"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth={1}
      />
      {/* Decorative concentric dashed guide */}
      <circle
        cx={center.cx}
        cy={center.cy}
        r={17}
        fill="none"
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={0.75}
        strokeDasharray="2 3"
      />
      {/* Glowing inner core */}
      <circle
        cx={center.cx}
        cy={center.cy}
        r={isAnimated ? 5.5 : 4}
        fill={isAnimated ? '#545460' : '#2b2b31'}
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth={1}
        style={{
          transition: 'all 0.6s cubic-bezier(0.85, 0, 0.15, 1)',
        }}
      />
    </g>
  );
};


/* -------------------------------------------------------------------------- */
/*               MetricSunburstCard: 50+ BI Solutions Tree                    */
/* -------------------------------------------------------------------------- */

// Hierarchical data tree for the 50+ BI Solutions delivered
const biSolutionsData: SunburstNode = {
  name: '50+ BI Solutions',
  children: [
    {
      name: 'Executive Dashboards',
      value: 20,
      children: [
        {
          name: 'C-Suite Cockpits',
          value: 7,
          children: [
            { name: 'Revenue & Margin KPI', value: 3.5 },
            { name: 'Global Operational P&L', value: 3.5 },
          ],
        },
        {
          name: 'Sales Performance',
          value: 7,
          children: [
            { name: 'Territory Velocity', value: 3.5 },
            { name: 'Churn & Retention', value: 3.5 },
          ],
        },
        {
          name: 'Financial Health',
          value: 6,
          children: [
            { name: 'Working Capital', value: 3 },
            { name: 'Cost Center Variance', value: 3 },
          ],
        },
      ],
    },
    {
      name: 'Data Models & DAX',
      value: 18,
      children: [
        {
          name: 'Star-Schema Marts',
          value: 6,
          children: [
            { name: 'Multi-Fact Conformed', value: 3 },
            { name: 'Type-2 SCD History', value: 3 },
          ],
        },
        {
          name: 'Advanced DAX Engine',
          value: 6,
          children: [
            { name: 'Time-Intelligence', value: 3 },
            { name: 'Semi-Additive Measures', value: 3 },
          ],
        },
        {
          name: 'Security & Governance',
          value: 6,
          children: [
            { name: 'Dynamic RLS / OLS', value: 3 },
            { name: 'Workspace Deployment', value: 3 },
          ],
        },
      ],
    },
    {
      name: 'ETL & Automated Refresh',
      value: 14,
      children: [
        {
          name: 'Power Automate Flows',
          value: 7,
          children: [
            { name: 'Scheduled PDF Digest', value: 3.5 },
            { name: 'Real-Time Alert Triggers', value: 3.5 },
          ],
        },
        {
          name: 'Cloud Data Pipelines',
          value: 7,
          children: [
            { name: 'Snowflake Ingestion', value: 3.5 },
            { name: 'Incremental Refresh', value: 3.5 },
          ],
        },
      ],
    },
  ],
};

export const MetricSunburstCard: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const { arcs } = useMemo(() => buildArcs(biSolutionsData, 240), []);

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-3">
      {/* Pure Sunburst Visual: Zero callout values, continuous looped breathing animation */}
      <div className="relative w-full h-[170px] sm:h-[185px] md:h-[195px] flex items-center justify-center">
        <SunburstChart
          data={biSolutionsData}
          size={240}
          triggerAnimation={isVisible}
          loop={true}
          className="w-full h-full flex items-center justify-center"
        >
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full max-h-[195px] overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Concentric radial segments */}
            <g className="sunburst-rings">
              {arcs.map((arc) => (
                <SunburstSegment key={arc.id} index={arc.arcIndex} />
              ))}
            </g>

            {/* Central Navigation Hub */}
            <SunburstCenter />
          </svg>
        </SunburstChart>
      </div>
    </div>
  );
};
