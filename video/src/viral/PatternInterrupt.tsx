import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import captionsData from '../captions.json';
import {classifyWord} from './classify';

type Caption = {text: string; startMs: number; endMs: number};

export const PatternInterrupt: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const captions = captionsData.captions as Caption[];

  let flash = 0;
  let chroma = 0;
  for (const c of captions) {
    const kind = classifyWord(c.text);
    if (kind === 'normal') continue;
    const enter = (c.startMs / 1000) * fps;
    const local = frame - enter;
    if (local >= 0 && local <= 4) {
      const f = interpolate(local, [0, 1, 4], [0, 0.55, 0], {extrapolateRight: 'clamp'});
      if (f > flash) flash = f;
    }
    if (kind === 'money' || kind === 'multiplier') {
      if (local >= 0 && local <= 6) {
        const c2 = interpolate(local, [0, 2, 6], [0, 0.4, 0], {extrapolateRight: 'clamp'});
        if (c2 > chroma) chroma = c2;
      }
    }
  }

  return (
    <>
      {chroma > 0 ? (
        <AbsoluteFill
          style={{
            mixBlendMode: 'screen',
            background:
              'radial-gradient(circle at 50% 50%, rgba(255,214,0,0.0) 30%, rgba(255,23,68,0.0) 60%, rgba(0,200,83,0.0) 100%)',
            opacity: chroma,
            boxShadow: `inset 0 0 ${Math.round(chroma * 220)}px rgba(255,214,0,0.55)`,
          }}
        />
      ) : null}
      {flash > 0 ? (
        <AbsoluteFill style={{background: '#FFFFFF', opacity: flash}} />
      ) : null}
    </>
  );
};
