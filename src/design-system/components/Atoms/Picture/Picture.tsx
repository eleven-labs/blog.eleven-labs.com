import type { SpacingSystemProps } from '@/design-system/types';

import React from 'react';

import { Box } from '@/design-system';

export interface PictureProps extends SpacingSystemProps {
  img: React.ComponentPropsWithoutRef<'img'> & { fetchPriority?: 'high' | 'low' | 'auto' };
  sources?: React.ComponentPropsWithoutRef<'source'>[];
}

export const Picture: React.FC<PictureProps> = ({ img, sources, ...props }) => {
  const { fetchPriority, ...imgProps } = img;

  // React 18 ne connaît pas la propriété `fetchPriority` : il la recopie telle quelle dans le DOM
  // en avertissant. On écrit donc directement l'attribut HTML, qui s'orthographie en minuscules.
  const fetchPriorityAttribute = fetchPriority ? { fetchpriority: fetchPriority } : {};

  return (
    <Box as="picture" display="block" {...props}>
      {sources?.map((source, key) => <source key={key} {...source} />)}
      <img {...imgProps} {...fetchPriorityAttribute} alt={img.alt} />
    </Box>
  );
};
