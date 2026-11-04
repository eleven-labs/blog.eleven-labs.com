import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { ContentImage } from './content-image';

export interface FigureProps extends ComponentPropsWithoutRef<'figure'> {
  src: string;
  alt: string;
  caption?: React.ReactNode;
}

// The caption is either the `caption` prop, or the children to write it in markdown
export const Figure: React.FC<FigureProps> = ({ src, alt, caption, children, ...props }) => (
  <figure {...props}>
    <ContentImage src={src} alt={alt} />
    {caption || children ? <figcaption>{caption ?? children}</figcaption> : null}
  </figure>
);
