import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { chartData, type ChartDataPoint } from './chartData';

interface BarSeriesConfig {
  dataKey: string;
  fill?: string;
  lineCap?: 'round' | 'butt' | number;
  animationType?: 'grow' | 'fade';
  fadedOpacity?: number;
}

interface BarChartContextType {
  data: ChartDataPoint[];
  xDataKey: string;
  maxValue: number;
  series: BarSeriesConfig[];
  registerSeries: (config: BarSeriesConfig) => void;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  isAnimated: boolean;
  viewWidth: number;
  viewHeight: number;
  margin: { top: number; right: number; bottom: number; left: number };
}

const BarChartContext = createContext<BarChartContextType | null>(null);

function useBarChart() {
  const context = useContext(BarChartContext);
  if (!context) {
    throw new Error('Bar chart subcomponents must be rendered inside <BarChart>');
  }
  return context;
}

/* -------------------------------------------------------------------------- */
/*                                  BarChart                                  */
/* -------------------------------------------------------------------------- */

export interface BarChartProps {
  data: ChartDataPoint[];
  xDataKey?: string;
  className?: string;
  animationDuration?: number;
  triggerAnimation?: boolean;
  loop?: boolean;
  children: ReactNode;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xDataKey = 'year',
  className = '',
  triggerAnimation = true,
  loop = true,
  children,
}) => {
  const [series, setSeries] = useState<BarSeriesConfig[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  const viewWidth = 320;
  const viewHeight = 165;
  const margin = { top: 14, right: 18, bottom: 26, left: 18 };

  // Calculate maximum value across all registered series with headroom
  const maxValue = Math.max(
    ...data.flatMap((d) =>
      series.length > 0
        ? series.map((s) => Number(d[s.dataKey]) || 0)
        : [Number(d.primary) || 0, Number(d.secondary) || 0]
    ),
    56
  );

  const registerSeries = (config: BarSeriesConfig) => {
    setSeries((prev) => {
      if (prev.some((s) => s.dataKey === config.dataKey)) return prev;
      return [...prev, config];
    });
  };

  // Continuous looping animation: grows, holds, retracts, and loops
  useEffect(() => {
    if (!triggerAnimation) {
      setIsAnimated(false);
      return;
    }

    if (!loop) {
      const timer = setTimeout(() => setIsAnimated(true), 100);
      return () => clearTimeout(timer);
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    let isMounted = true;

    const runLoop = () => {
      if (!isMounted) return;
      setIsAnimated(true);

      // Hold at peak for 2.0s after animation finishes
      timeoutId = setTimeout(() => {
        if (!isMounted) return;
        setIsAnimated(false);

        // Wait 600ms for smooth retract, then loop again
        timeoutId = setTimeout(() => {
          if (!isMounted) return;
          runLoop();
        }, 650);
      }, 2900);
    };

    const initialTimer = setTimeout(runLoop, 120);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      clearTimeout(timeoutId);
    };
  }, [triggerAnimation, loop]);

  return (
    <BarChartContext.Provider
      value={{
        data,
        xDataKey,
        maxValue,
        series,
        registerSeries,
        hoveredIndex,
        setHoveredIndex,
        isAnimated,
        viewWidth,
        viewHeight,
        margin,
      }}
    >
      <div className={`relative w-full h-full select-none ${className}`}>
        {children}
      </div>
    </BarChartContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    Grid                                    */
/* -------------------------------------------------------------------------- */

export interface GridProps {
  horizontal?: boolean;
  vertical?: boolean;
  fadeHorizontal?: boolean;
}

export const Grid: React.FC<GridProps> = ({
  horizontal = true,
}) => {
  const { viewWidth, viewHeight, margin } = useBarChart();
  const plotHeight = viewHeight - margin.top - margin.bottom;
  const gridLines = 4;

  return (
    <g className="chart-grid pointer-events-none">
      {horizontal &&
        Array.from({ length: gridLines }).map((_, i) => {
          const y = margin.top + (plotHeight / (gridLines - 1)) * i;
          return (
            <line
              key={`h-grid-${i}`}
              x1={margin.left}
              y1={y}
              x2={viewWidth - margin.right}
              y2={y}
              stroke="rgba(255, 255, 255, 0.09)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
    </g>
  );
};

/* -------------------------------------------------------------------------- */
/*                                     Bar                                    */
/* -------------------------------------------------------------------------- */

export interface BarProps {
  dataKey: string;
  fill?: string;
  lineCap?: 'round' | 'butt' | number;
  animationType?: 'grow' | 'fade';
  fadedOpacity?: number;
}

export const Bar: React.FC<BarProps> = ({
  dataKey,
  fill = '#2b2b31',
  lineCap = 'round',
  animationType = 'grow',
  fadedOpacity = 0.5,
}) => {
  const {
    data,
    series,
    registerSeries,
    maxValue,
    hoveredIndex,
    setHoveredIndex,
    isAnimated,
    viewWidth,
    viewHeight,
    margin,
  } = useBarChart();

  useEffect(() => {
    registerSeries({ dataKey, fill, lineCap, animationType, fadedOpacity });
  }, [dataKey, fill, lineCap, animationType, fadedOpacity]);

  const seriesIndex = series.findIndex((s) => s.dataKey === dataKey);
  const currentSeriesIndex = seriesIndex >= 0 ? seriesIndex : 0;
  const totalSeries = Math.max(series.length, 2);

  const plotWidth = viewWidth - margin.left - margin.right;
  const plotHeight = viewHeight - margin.top - margin.bottom;
  const groupWidth = plotWidth / data.length;

  // Sizing for 3 groups: wide, thick, chunky rounded bars matching user screenshot
  const barWidth = 28;
  const barGap = 6;
  const groupBarsWidth = totalSeries * barWidth + (totalSeries - 1) * barGap;

  return (
    <g className={`chart-bars-${dataKey}`}>
      {data.map((datum, i) => {
        const val = Number(datum[dataKey]) || 0;
        const targetHeight = Math.max(6, (val / maxValue) * plotHeight);
        const height = isAnimated ? targetHeight : 0;
        const baselineY = margin.top + plotHeight;
        const y = isAnimated ? baselineY - targetHeight : baselineY;

        const groupCenterX = margin.left + i * groupWidth + groupWidth / 2;
        const startX = groupCenterX - groupBarsWidth / 2;
        const x = startX + currentSeriesIndex * (barWidth + barGap);

        const isHovered = hoveredIndex === i;
        const isDimmed = hoveredIndex !== null && !isHovered;
        const opacity = isDimmed ? fadedOpacity : 1;

        // Custom pill radius (smooth rounding at top & bottom for thicker bars)
        const rx = lineCap === 'round' ? 8 : typeof lineCap === 'number' ? lineCap : 0;

        return (
          <g
            key={`${dataKey}-${i}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Rendered Bar with continuous organic looped animation */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={height}
              rx={rx}
              ry={rx}
              fill={fill}
              opacity={opacity}
              style={{
                transitionProperty: 'height, y, opacity',
                transitionDuration: isAnimated ? '0.95s, 0.95s, 0.25s' : '0.5s, 0.5s, 0.25s',
                transitionTimingFunction: isAnimated
                  ? 'cubic-bezier(0.85, 0, 0.15, 1), cubic-bezier(0.85, 0, 0.15, 1), ease'
                  : 'ease-in-out, ease-in-out, ease',
                transitionDelay: isAnimated
                  ? `${i * 0.25 + currentSeriesIndex * 0.08}s, ${i * 0.25 + currentSeriesIndex * 0.08}s, 0s`
                  : '0s, 0s, 0s',
                transformOrigin: 'bottom',
              }}
            />
          </g>
        );
      })}
    </g>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   BarXAxis                                 */
/* -------------------------------------------------------------------------- */

export interface BarXAxisProps {
  className?: string;
}

export const BarXAxis: React.FC<BarXAxisProps> = ({ className = '' }) => {
  const { data, xDataKey, hoveredIndex, setHoveredIndex, viewWidth, viewHeight, margin } =
    useBarChart();

  const plotWidth = viewWidth - margin.left - margin.right;
  const groupWidth = plotWidth / data.length;
  const yPos = viewHeight - 7;

  return (
    <g className={`chart-x-axis ${className}`}>
      {data.map((datum, i) => {
        const groupCenterX = margin.left + i * groupWidth + groupWidth / 2;
        const isHovered = hoveredIndex === i;
        const label = String(datum[xDataKey] || '');

        return (
          <text
            key={`x-axis-${i}`}
            x={groupCenterX}
            y={yPos}
            textAnchor="middle"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="text-[11px] font-medium tracking-wide transition-colors duration-200 pointer-events-none"
            fill={isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.55)'}
          >
            {label}
          </text>
        );
      })}
    </g>
  );
};

/* -------------------------------------------------------------------------- */
/*             MetricBarChartCard: Pure Chart & Looped Animation               */
/* -------------------------------------------------------------------------- */

export const MetricBarChartCard: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-3">
      {/* Pure Chart Visual: No callout values, no extra text, continuous looped animation */}
      <div className="relative w-full h-[170px] sm:h-[185px] md:h-[195px] flex items-center justify-center">
        <BarChart
          data={chartData}
          xDataKey="year"
          triggerAnimation={isVisible}
          loop={true}
          className="w-full h-full flex items-center justify-center"
        >
          <svg
            viewBox="0 0 320 165"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Dashed Horizontal Grid Lines matching user screenshot */}
            <Grid horizontal />

            {/* Dark Charcoal Grey Bar (#2b2b31) */}
            <Bar
              dataKey="primary"
              fill="#2b2b31"
              lineCap="round"
            />

            {/* Lighter Slate Grey Bar (#545460) */}
            <Bar
              dataKey="secondary"
              fill="#545460"
              lineCap="round"
            />

            {/* Year 1, Year 2, Year 3 Axis */}
            <BarXAxis />
          </svg>
        </BarChart>
      </div>
    </div>
  );
};
