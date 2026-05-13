import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import captionsData from '../captions.json';
import {classifyWord} from './classify';

type Caption = {text: string; startMs: number; endMs: number};

export const AutoZoom: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const ms = (frame / fps) * 1000;

  const captions = captionsData.captions as Caption[];

  let punchScale = 1;
  for (const c of captions) {
    const kind = classifyWord(c.text);
    if (kind === 'normal') continue;
    const enter = (c.startMs / 1000) * fps;
    const local = frame - enter;
    const punchDur = Math.round(fps * 0.45);
    if (local >= 0 && local <= punchDur) {
      const t = local / punchDur;
      const eased = Easing.bezier(0.22, 1, 0.36, 1)(t);
      const peak = kind === 'money' || kind === 'multiplier' ? 1.18 : 1.1;
      const s = interpolate(eased, [0, 0.3, 1], [1, peak, 1.04]);
      if (s > punchScale) punchScale = s;
    }
  }

  const oscillation =
    1 +
    0.025 * Math.sin((frame / durationInFrames) * Math.PI * 6) +
    0.015 * Math.sin((frame / durationInFrames) * Math.PI * 14);

  const scale = punchScale * oscillation;

  const drift = 12 * Math.sin((frame / durationInFrames) * Math.PI * 4);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translateX(${drift}px) scale(${scale})`}}>
        <OffthreadVideo src={staticFile('input.mp4')} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
