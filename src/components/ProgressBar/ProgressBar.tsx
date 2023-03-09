import './ProgressBar.scss';

import { Box, MarginSystemProps } from '@eleven-labs/design-system';
import React from 'react';

export type ProgressBarOptions = {
  value: number;
  max: number;
};

export type ProgressBarProps = MarginSystemProps & ProgressBarOptions;

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, ...boxProps }) => (
  <Box {...boxProps} className="progress-bar">
    <style
      dangerouslySetInnerHTML={{ __html: `.progress-bar::before { width: ${Math.round((value / max) * 100)}% }` }}
    />
    <progress value={value} max={max}>
      {value}%
    </progress>
  </Box>
);
