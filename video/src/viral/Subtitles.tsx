import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import captionsData from '../captions.json';
import {classifyWord, type Kind} from './classify';

type Caption = {text: string; startMs: number; endMs: number};

const COLORS: Record<Kind, {bg: string; fg: string; stroke: string}> = {
  money:      {bg: '#00C853', fg: '#FFFFFF', stroke: '#003D1F'},
  percent:    {bg: '#00C853', fg: '#FFFFFF', stroke: '#003D1F'},
  multiplier: {bg: '#FFD600', fg: '#0A0A0A', stroke: '#000000'},
  profit:     {bg: '#00C853', fg: '#FFFFFF', stroke: '#003D1F'},
  hook:       {bg: '#FF1744', fg: '#FFFFFF', stroke: '#3A0006'},
  normal:     {bg: 'transparent', fg: '#FFFFFF', stroke: '#000000'},
};

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  const captions = (captionsData.captions as Caption[]).filter(
    (c) => currentMs >= c.startMs - 80 && currentMs <= c.endMs + 80,
  );

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 380}}>
      {captions.map((c) => {
        const kind = classifyWord(c.text);
        const colors = COLORS[kind];
        const enterFrame = (c.startMs / 1000) * fps;
        const popped = spring({
          fps,
          frame: frame - enterFrame,
          config: {damping: 12, stiffness: 220, mass: 0.5},
        });
        const scale = interpolate(popped, [0, 1], [0.6, 1]);
        const isBig = kind !== 'normal';
        const fontSize = isBig ? 170 : 130;
        return (
          <div
            key={c.startMs}
            style={{
              transform: `scale(${scale}) rotate(${isBig ? (frame % 2 === 0 ? -1.5 : 1.5) : 0}deg)`,
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontWeight: 900,
              fontSize,
              lineHeight: 1,
              color: colors.fg,
              background: colors.bg === 'transparent' ? 'rgba(0,0,0,0.0)' : colors.bg,
              padding: isBig ? '24px 40px' : '16px 28px',
              borderRadius: 28,
              border: isBig ? `6px solid ${colors.stroke}` : 'none',
              textTransform: 'uppercase',
              letterSpacing: -2,
              WebkitTextStroke: `${isBig ? 10 : 8}px ${colors.stroke}`,
              paintOrder: 'stroke fill',
              textShadow: isBig
                ? '0 12px 0 rgba(0,0,0,0.45), 0 0 40px rgba(255,214,0,0.6)'
                : '0 8px 0 rgba(0,0,0,0.55)',
              boxShadow: isBig ? '0 18px 0 rgba(0,0,0,0.35)' : 'none',
            }}
          >
            {c.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
