import React, { useState, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';

export interface GaugeProps {
  orientation?: 'arc' | 'linear';
  value: number; // Fill level 0–100
  centerValue?: number; // Optional; omitted for track-only pure visual
  totalNotches?: number;
  spacing?: number; // % gap between notches
  notchLengthPercent?: number;
  notchWidthPercent?: number;
  notchCornerRadius?: number;
  uniformWidth?: boolean;
  startAngle?: number; // Arc sweep start in degrees (default 135)
  endAngle?: number; // Arc sweep end in degrees (default 405)
  linearHeight?: number;
  useGradient?: boolean;
  activeGradient?: [string, string];
  inactiveGradient?: [string, string];
  activeFill?: string;
  inactiveFill?: string;
  activeFillOpacity?: number;
  inactiveFillOpacity?: number;
  triggerAnimation?: boolean;
  loop?: boolean;
  className?: string;
  children?: ReactNode;
}

export const Gauge: React.FC<GaugeProps> = ({
  orientation = 'arc',
  value = 88,
  totalNotches = 42,
  spacing = 25,
  notchLengthPercent = 100,
  notchCornerRadius = 3,
  startAngle = 135,
  endAngle = 405,
  linearHeight = 24,
  useGradient = true,
  activeFill = '#545460',
  inactiveFill = '#222228',
  activeFillOpacity = 1,
  inactiveFillOpacity = 0.35,
  triggerAnimation = true,
  loop = true,
  className = '',
  children,
}) => {
  // Continuous fluid fill level (0.0 to 100.0) driven smoothly by GSAP
  const [currentFill, setCurrentFill] = useState(0);
  const animTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!triggerAnimation) {
      if (animTimelineRef.current) animTimelineRef.current.kill();
      setCurrentFill(0);
      return;
    }

    const state = { fill: 0 };

    if (!loop) {
      const tween = gsap.to(state, {
        fill: value,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => setCurrentFill(state.fill),
      });
      return () => {
        tween.kill();
      };
    }

    // Ultra-smooth continuous timeline:
    // 1. Silky progressive sweep up (power2.inOut, 1.7s)
    // 2. Soft organic breathing pulse at peak (1.6s)
    // 3. Smooth, elegant retract back to zero (power2.inOut, 1.1s)
    // 4. Subtle resting pause, then repeat infinitely
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.45,
    });

    tl.to(state, {
      fill: 100, // sweeps all the way to the very end of the arc
      duration: 1.85,
      ease: 'power2.out',
      onUpdate: () => setCurrentFill(state.fill),
    })
      .to(state, {
        fill: 100,
        duration: 1.8,
        ease: 'none',
        onUpdate: () => setCurrentFill(state.fill),
      })
      .to(state, {
        fill: 0,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => setCurrentFill(state.fill),
      });

    animTimelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [triggerAnimation, loop, value]);

  // Notch calculations for Arc mode
  const arcNotches = useMemo(() => {
    if (orientation !== 'arc') return [];

    const cx = 120;
    const cy = 118;
    const rOut = 86;
    const rIn = rOut - (22 * notchLengthPercent) / 100;
    const sweep = endAngle - startAngle;

    const notches = [];
    for (let i = 0; i < totalNotches; i++) {
      const frac = i / (totalNotches - 1);
      const angleDeg = startAngle + frac * sweep;
      const angleRad = (angleDeg * Math.PI) / 180;

      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);

      const x1 = cx + rIn * cos;
      const y1 = cy + rIn * sin;
      const x2 = cx + rOut * cos;
      const y2 = cy + rOut * sin;

      // Continuous fluid threshold calculation
      const notchValueThreshold = frac * 100;
      const delta = currentFill - notchValueThreshold;

      // Smooth soft-edge intensity ramp (0.0 to 1.0)
      const intensity = Math.min(1, Math.max(0, (delta + 2.5) / 5.0));

      // Check if this notch is right at the active leading wavefront
      const isLeadingEdge = Math.abs(delta) < 2.0 && currentFill > 1;

      // Color interpolation: inactive (#222228) -> active slate (#545460) -> silver highlight (#a4a4b8)
      let color = inactiveFill;
      if (intensity > 0) {
        if (isLeadingEdge) {
          color = '#ffffff'; // Bright glowing tip at the wave head
        } else if (useGradient) {
          const gradientFrac = i / totalNotches;
          color = gradientFrac > 0.7 ? '#8e8ea2' : gradientFrac > 0.35 ? '#6a6a7c' : activeFill;
        } else {
          color = activeFill;
        }
      }

      const opacity =
        inactiveFillOpacity + intensity * (activeFillOpacity - inactiveFillOpacity);

      // Micro dynamic thickness on active notches
      const strokeWidth =
        intensity > 0.7 ? (isLeadingEdge ? 3.8 : 3.4) : notchCornerRadius > 0 ? 2.8 : 2.2;

      notches.push({
        index: i,
        x1,
        y1,
        x2,
        y2,
        color,
        opacity,
        strokeWidth,
        isLeadingEdge,
      });
    }
    return notches;
  }, [
    orientation,
    totalNotches,
    startAngle,
    endAngle,
    notchLengthPercent,
    notchCornerRadius,
    currentFill,
    useGradient,
    activeFill,
    inactiveFill,
    activeFillOpacity,
    inactiveFillOpacity,
  ]);

  if (orientation === 'linear') {
    return (
      <div className={`relative w-full select-none ${className}`}>
        <svg
          viewBox="0 0 320 32"
          className="w-full h-auto overflow-visible"
          preserveAspectRatio="none"
        >
          {children}
          {Array.from({ length: totalNotches }).map((_, i) => {
            const notchFrac = (i / totalNotches) * 100;
            const delta = currentFill - notchFrac;
            const intensity = Math.min(1, Math.max(0, (delta + 2) / 4.0));
            const slotWidth = 320 / totalNotches;
            const notchWidth = slotWidth * (1 - spacing / 100);
            const x = i * slotWidth + (slotWidth - notchWidth) / 2;

            return (
              <rect
                key={`linear-notch-${i}`}
                x={x}
                y={4}
                width={notchWidth}
                height={linearHeight}
                rx={notchCornerRadius}
                fill={intensity > 0.5 ? activeFill : inactiveFill}
                fillOpacity={0.35 + intensity * 0.65}
              />
            );
          })}
        </svg>
      </div>
    );
  }

  // Active sweep angle in radians for inner accent track
  const cx = 120;
  const cy = 118;
  const trackRadius = 56;

  const activeSweepFraction = Math.min(1, Math.max(0, currentFill / 100));
  const activeEndAngleDeg = startAngle + activeSweepFraction * (endAngle - startAngle);
  const activeEndAngleRad = (activeEndAngleDeg * Math.PI) / 180;
  const startAngleRad = (startAngle * Math.PI) / 180;

  // Real-time calculated arc coordinates for subpixel smooth motion
  const xStart = cx + trackRadius * Math.cos(startAngleRad);
  const yStart = cy + trackRadius * Math.sin(startAngleRad);
  const xEndActive = cx + trackRadius * Math.cos(activeEndAngleRad);
  const yEndActive = cy + trackRadius * Math.sin(activeEndAngleRad);
  const largeArcActive = activeEndAngleDeg - startAngle > 180 ? 1 : 0;

  // Needle indicator pointing from center hub all the way to the outer perimeter
  const needleInnerRadius = 14;
  const needleOuterRadius = 86; // reaches all the way to the outer end of the notches
  const needleX1 = cx + needleInnerRadius * Math.cos(activeEndAngleRad);
  const needleY1 = cy + needleInnerRadius * Math.sin(activeEndAngleRad);
  const needleX2 = cx + needleOuterRadius * Math.cos(activeEndAngleRad);
  const needleY2 = cy + needleOuterRadius * Math.sin(activeEndAngleRad);

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 240 215"
        className="w-full h-full max-h-[195px] overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Ambient atmosphere glow */}
          <radialGradient id="gaugeAtmosphere" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#545460" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          {children}
        </defs>

        {/* Ambient center atmosphere glow */}
        <circle cx={cx} cy={cy} r={70} fill="url(#gaugeAtmosphere)" pointerEvents="none" />

        {/* Inactive Inner Track Guide Ring */}
        <circle
          cx={cx}
          cy={cy}
          r={trackRadius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* Active Inner Track Arc (subpixel smooth sweep) */}
        {activeSweepFraction > 0.01 && (
          <path
            d={`M ${xStart.toFixed(2)} ${yStart.toFixed(2)} A ${trackRadius} ${trackRadius} 0 ${largeArcActive} 1 ${xEndActive.toFixed(2)} ${yEndActive.toFixed(2)}`}
            fill="none"
            stroke="#545460"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* Array of 42 Fluid Notches */}
        <g className="gauge-notches">
          {arcNotches.map((notch) => (
            <line
              key={`notch-${notch.index}`}
              x1={notch.x1.toFixed(1)}
              y1={notch.y1.toFixed(1)}
              x2={notch.x2.toFixed(1)}
              y2={notch.y2.toFixed(1)}
              stroke={notch.color}
              strokeWidth={notch.strokeWidth}
              strokeLinecap="round"
              strokeOpacity={notch.opacity}
            />
          ))}
        </g>

        {/* Dynamic Sweeping Needle - Extends all the way from hub to the outer end */}
        {currentFill > 0.5 && (
          <g className="gauge-needle pointer-events-none">
            {/* Luminous glow behind needle */}
            <line
              x1={needleX1.toFixed(2)}
              y1={needleY1.toFixed(2)}
              x2={needleX2.toFixed(2)}
              y2={needleY2.toFixed(2)}
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Crisp illuminated needle shaft */}
            <line
              x1={needleX1.toFixed(2)}
              y1={needleY1.toFixed(2)}
              x2={needleX2.toFixed(2)}
              y2={needleY2.toFixed(2)}
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Luminous pointer tip at the outer perimeter */}
            <circle
              cx={needleX2.toFixed(2)}
              cy={needleY2.toFixed(2)}
              r={2.6}
              fill="#ffffff"
            />
          </g>
        )}

        {/* Center Hub / Core (No text, pure telemetry hub) */}
        <g className="gauge-center-hub pointer-events-none">
          {/* Outer hub bezel */}
          <circle
            cx={cx}
            cy={cy}
            r={24}
            fill="#121215"
            stroke="rgba(255, 255, 255, 0.14)"
            strokeWidth="1"
          />
          {/* Concentric guide ring */}
          <circle
            cx={cx}
            cy={cy}
            r={18}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="0.75"
            strokeDasharray="2 2"
          />
          {/* Glowing central indicator node */}
          <circle
            cx={cx}
            cy={cy}
            r={currentFill > 0 ? 5.5 : 4}
            fill={currentFill > 0 ? '#545460' : '#222228'}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1"
          />
          {/* Core center micro-dot */}
          <circle
            cx={cx}
            cy={cy}
            r={currentFill > 0 ? 2.4 : 1.6}
            fill={currentFill > 0 ? '#ffffff' : '#888896'}
          />
        </g>
      </svg>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*               MetricGaugeCard: Card Component Container                    */
/* -------------------------------------------------------------------------- */

export const MetricGaugeCard: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-3">
      {/* Pure Gauge Visual: Zero callout values, silky smooth continuous looped animation */}
      <div className="relative w-full h-[170px] sm:h-[185px] md:h-[195px] flex items-center justify-center">
        <Gauge
          orientation="arc"
          value={100}
          totalNotches={42}
          spacing={25}
          notchCornerRadius={3}
          startAngle={135}
          endAngle={405}
          useGradient={true}
          activeFill="#545460"
          inactiveFill="#222228"
          activeFillOpacity={1}
          inactiveFillOpacity={0.35}
          triggerAnimation={isVisible}
          loop={true}
          className="w-full h-full flex items-center justify-center"
        />
      </div>
    </div>
  );
};
