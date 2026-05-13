import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

export const Vignette: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const intensity = 0.55 + 0.08 * Math.sin(t * 2.4);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 48%, rgba(0,0,0,${intensity}) 100%)`,
        pointerEvents: 'none',
      }}
    />
  );
};
