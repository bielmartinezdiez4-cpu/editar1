import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';

const BADGES: {start: number; end: number; text: string; color: string}[] = [
  {start: 0.0, end: 1.27, text: '🔥 DÍA 1', color: '#FF1744'},
  {start: 1.95, end: 3.0, text: '👀 SOLO 17 AÑOS', color: '#FFD600'},
  {start: 6.7, end: 8.3, text: '🚫 NO COMO TODOS', color: '#FF1744'},
  {start: 8.9, end: 9.98, text: '👕 ROPA REAL', color: '#00C853'},
  {start: 14.8, end: 16.76, text: '🚀 SEMANA 0', color: '#00C853'},
];

export const HookBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 110}}>
      {BADGES.map((b, i) => {
        if (t < b.start - 0.1 || t > b.end + 0.1) return null;
        const local = frame - b.start * fps;
        const popIn = spring({fps, frame: local, config: {damping: 11, stiffness: 200, mass: 0.6}});
        const popOut = interpolate(t, [b.end - 0.25, b.end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const wobble = 1.5 * Math.sin(local * 0.7);
        return (
          <div
            key={i}
            style={{
              transform: `scale(${popIn * popOut}) rotate(${wobble}deg)`,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 900,
              fontSize: 68,
              color: '#0A0A0A',
              background: b.color,
              padding: '18px 36px',
              borderRadius: 999,
              border: '6px solid #000',
              boxShadow: '0 14px 0 rgba(0,0,0,0.45), 0 0 30px rgba(255,255,255,0.25)',
              textTransform: 'uppercase',
              letterSpacing: -1,
              WebkitTextStroke: '3px #000',
              paintOrder: 'stroke fill',
            }}
          >
            {b.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
