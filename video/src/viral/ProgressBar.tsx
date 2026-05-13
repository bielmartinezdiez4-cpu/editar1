import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const pct = Math.min(1, frame / durationInFrames);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'stretch'}}>
      <div style={{height: 14, background: 'rgba(0,0,0,0.35)'}}>
        <div
          style={{
            width: `${pct * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #FFD600 0%, #00C853 50%, #FF1744 100%)',
            boxShadow: '0 0 14px rgba(255,214,0,0.7)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
