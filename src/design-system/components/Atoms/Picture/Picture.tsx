import React from 'react';

import { cn } from '@/design-system/helpers/cn';

export interface PictureProps {
  img: React.ComponentPropsWithoutRef<'img'> & { fetchPriority?: 'high' | 'low' | 'auto' };
  sources?: React.ComponentPropsWithoutRef<'source'>[];
  className?: string;
}

export const Picture: React.FC<PictureProps> = ({ img, sources, className }) => {
  const { fetchPriority, ...imgProps } = img;

  // React 18 ne connaît pas la propriété `fetchPriority` : il la recopie telle quelle dans le DOM
  // en avertissant. On écrit donc directement l'attribut HTML, qui s'orthographie en minuscules.
  const fetchPriorityAttribute = fetchPriority ? { fetchpriority: fetchPriority } : {};

  return (
    <picture className={cn('block', className)}>
      {sources?.map((source, key) => <source key={key} {...source} />)}
      <img {...imgProps} {...fetchPriorityAttribute} alt={img.alt} />
    </picture>
  );
};
