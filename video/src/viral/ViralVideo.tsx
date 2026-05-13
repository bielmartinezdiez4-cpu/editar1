import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AutoZoom} from './AutoZoom';
import {PatternInterrupt} from './PatternInterrupt';
import {Subtitles} from './Subtitles';
import {Vignette} from './Vignette';
import {ProgressBar} from './ProgressBar';
import {HookBadge} from './HookBadge';

export const ViralVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AutoZoom />
      <Vignette />
      <PatternInterrupt />
      <HookBadge />
      <Subtitles />
      <ProgressBar />
    </AbsoluteFill>
  );
};
