/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Category, WheelSegment } from '../types';
import { playTickSound, playPopSound } from '../utils/audio';

interface Segment {
  category: Category;
  label: string;
  emoji: string;
  color: string;
}

const SEGMENTS: Segment[] = [
  { category: 'food', label: 'Food', emoji: '🍜', color: '#f43f5e' }, // Rose 500
  { category: 'game', label: 'Game', emoji: '🎲', color: '#8b5cf6' }, // Purple 500
  { category: 'creative', label: 'Creative', emoji: '🎨', color: '#f97316' }, // Orange 500
  { category: 'explore', label: 'Explore', emoji: '🚗', color: '#10b981' }, // Emerald 500
  { category: 'movie', label: 'Movie', emoji: '🎥', color: '#06b6d4' }, // Cyan 500
  { category: 'cafe', label: 'Cafe', emoji: '☕', color: '#ec4899' }, // Pink 500
  { category: 'challenge', label: 'Challenge', emoji: '📸', color: '#eab308' }, // Yellow 500
  { category: 'surprise', label: 'Surprise', emoji: '🌌', color: '#3b82f6' } // Blue 500
];

interface SpinningWheelProps {
  isSpinning: boolean;
  onSpinEnd: (category: Category) => void;
  triggerSpin: () => void;
  targetIndex: number;
  segments: WheelSegment[];
}

export const SpinningWheel: React.FC<SpinningWheelProps> = ({
  isSpinning,
  onSpinEnd,
  triggerSpin,
  targetIndex,
  segments
}) => {
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const requestRef = useRef<number | null>(null);
  const lastTickAngleRef = useRef(0);

  const activeSlices = segments && segments.length > 0 ? segments : SEGMENTS;

  // Keep refs for activeSlices and onSpinEnd to avoid resetting the physics loop on re-renders
  const activeSlicesRef = useRef(activeSlices);
  const onSpinEndRef = useRef(onSpinEnd);

  useEffect(() => {
    activeSlicesRef.current = activeSlices;
  }, [activeSlices]);

  useEffect(() => {
    onSpinEndRef.current = onSpinEnd;
  }, [onSpinEnd]);

  // Handle spin physics
  useEffect(() => {
    if (!isSpinning) return;

    const currentSlices = activeSlicesRef.current;
    const startRotation = rotationRef.current;
    const validatedTargetIndex = targetIndex >= 0 && targetIndex < currentSlices.length ? targetIndex : 0;

    // Calculate final resting angle to point exactly to the center of the segment under the top pointer (270 degrees)
    const segmentCenterAngle = validatedTargetIndex * (360 / currentSlices.length) + (180 / currentSlices.length);
    const targetAngleOffset = (270 - segmentCenterAngle - (startRotation % 360) + 720) % 360;

    // Spin 5 full rounds plus the target offset for high excitement
    const totalRotationToSpin = 5 * 360 + targetAngleOffset;

    lastTickAngleRef.current = startRotation;
    const startTime = Date.now();
    const duration = 3500; // 3.5 seconds spin

    // Quartic ease-out function for extremely smooth deceleration
    const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);

    const animateSpin = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easeOutQuart(progress);
      const currentRotation = startRotation + totalRotationToSpin * easedProgress;

      rotationRef.current = currentRotation;
      setRotation(currentRotation);

      // Sound ticking calculation (triggers every sector boundary)
      const sectorBoundaryAngle = 360 / currentSlices.length;
      const crossedBoundaries = Math.floor(currentRotation / sectorBoundaryAngle) - Math.floor(lastTickAngleRef.current / sectorBoundaryAngle);
      if (crossedBoundaries > 0) {
        playTickSound();
        lastTickAngleRef.current = currentRotation;
      }

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animateSpin);
      } else {
        // Stop spin
        if (requestRef.current) cancelAnimationFrame(requestRef.current);

        playPopSound();
        onSpinEndRef.current(currentSlices[validatedTargetIndex].category);
      }
    };

    requestRef.current = requestAnimationFrame(animateSpin);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isSpinning, targetIndex]);

  // Draw the slices in SVG
  const radius = 145;
  const center = 150;

  const getCoordinatesForPercent = (percent: number) => {
    const x = cx + rx * Math.cos(2 * Math.PI * percent);
    const y = cy + ry * Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const cx = center;
  const cy = center;
  const rx = radius;
  const ry = radius;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Outer spinning ring with dotted lights */}
      <div className="relative p-3 bg-neutral-900 border-8 border-neutral-800 rounded-full shadow-2xl overflow-visible max-w-[340px] aspect-square w-full">
        {/* Lights */}
        <div className="absolute inset-0 border-4 border-dashed border-rose-500 rounded-full animate-spin [animation-duration:30s] pointer-events-none" />

        {/* The Wheel */}
        <div
          id="roulette-wheel-container"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'none' : 'transform 0.5s ease-out'
          }}
          className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-inner bg-white select-none relative"
        >
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <g>
              {activeSlices.map((seg, idx) => {
                const percent = 1 / activeSlices.length;
                const startPercent = idx * percent;
                const endPercent = (idx + 1) * percent;

                // Sector Path Calculation
                const [startX, startY] = getCoordinatesForPercent(startPercent);
                const [endX, endY] = getCoordinatesForPercent(endPercent);

                const largeArcFlag = percent > 0.5 ? 1 : 0;

                const pathData = [
                  `M ${center} ${center}`,
                  `L ${startX} ${startY}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                  'Z'
                ].join(' ');

                // Text angle (middle of sector)
                const textPercent = startPercent + percent / 2;
                const textAngle = textPercent * 2 * Math.PI;
                const textRadius = radius * 0.65;
                const textX = center + textRadius * Math.cos(textAngle);
                const textY = center + textRadius * Math.sin(textAngle);

                // Rotate text to look beautiful
                const textRotation = textPercent * 360 + 90;

                // Clean the title label: strip emojis and limit characters
                const rawLabel = 'label' in seg ? seg.label : '';
                const cleanLabel = rawLabel.replace(/^[^\w\s]*\s*/, '').trim();
                const displayLabel = cleanLabel.length > 12 ? cleanLabel.substring(0, 10) + '..' : cleanLabel || ('category' in seg ? seg.category : '');

                return (
                  <g key={`${seg.category}-${idx}`} className="cursor-pointer">
                    <path
                      d={pathData}
                      fill={seg.color}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                    <g transform={`translate(${textX}, ${textY}) rotate(${textRotation})`}>
                      <text
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fill="#ffffff"
                        fontSize="13"
                        fontWeight="bold"
                        className="font-display select-none filter drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.6)]"
                      >
                        {seg.emoji}
                      </text>
                      <text
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        y="14"
                        fill="#ffffff"
                        fontSize="7"
                        fontWeight="black"
                        className="font-display uppercase tracking-wider select-none filter drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.6)]"
                      >
                        {displayLabel}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* Inner aesthetic target circle */}
            <circle cx={center} cy={center} r="35" fill="#171717" stroke="#ffffff" strokeWidth="4" />
          </svg>

          {/* Central neon heart button overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 bg-neutral-900 border-2 border-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-2xl text-rose-500">❤️</span>
            </div>
          </div>
        </div>

        {/* Wheel Pin/Pointer at the TOP */}
        <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
          {/* Triangular pointy arrow indicator */}
          <div className="w-7 h-7 bg-white border-4 border-neutral-900 rounded-b-md shadow-lg transform rotate-45 border-t-0 border-l-0" />
          <div className="w-5 h-5 bg-rose-500 rounded-full absolute top-[1px] left-[5px] animate-ping" />
          <div className="w-5 h-5 bg-rose-600 rounded-full absolute top-[1px] left-[5px]" />
        </div>
      </div>

      {/* Playful Spin Button directly below the wheel */}
      <button
        id="btn-spin-now"
        disabled={isSpinning}
        onClick={triggerSpin}
        className={`mt-6 px-10 py-4 font-display text-lg font-extrabold uppercase rounded-full shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] border-4 border-black tracking-widest transition-all duration-200 transform hover:-translate-y-1 active:translate-y-1 active:shadow-none hover:rotate-1 ${
          isSpinning
            ? 'bg-neutral-300 text-neutral-500 border-neutral-400 cursor-not-allowed shadow-none translate-y-1'
            : 'bg-yellow-400 text-black hover:bg-yellow-300'
        }`}
      >
        {isSpinning ? '🎡 SPINNING...' : '⚡ SPIN DATE ❤️'}
      </button>
    </div>
  );
};
