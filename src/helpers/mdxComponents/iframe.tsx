import React from 'react';

export interface IframeProps {
  // The embed URL given by the service, such as CodePen
  src: string;
  // Read by the screen readers
  title: string;
  height: number;
}

// An embedded page, such as a CodePen demo: its height is reserved before it loads, and it loads lazily
export const Iframe: React.FC<IframeProps> = ({ src, title, height }) => (
  <iframe className="mb-3 w-full border-0" style={{ height }} src={src} title={title} loading="lazy" allowFullScreen />
);
