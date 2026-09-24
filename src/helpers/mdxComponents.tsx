import type { ComponentPropsWithoutRef, ReminderProps } from '@/design-system';

import React from 'react';

import { Reminder as ReminderBase } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

/**
 * An image of a content: the `maxWidth`, `maxHeight`, `width` and `height` parameters of its url size it,
 * e.g. `schema.png?maxWidth=400`.
 */
export const ContentImage: React.FC<ComponentPropsWithoutRef<'img'>> = (props) => {
  const urlParams = new URLSearchParams(props.src?.split('?')?.[1] ?? '');
  return React.createElement('img', {
    // A tutorial gathers all of its steps on one page, its images are only loaded when read
    loading: 'lazy',
    decoding: 'async',
    ...props,
    style: {
      maxWidth: urlParams.get('maxWidth') ? `${urlParams.get('maxWidth')}px` : undefined,
      maxHeight: urlParams.get('maxHeight') ? `${urlParams.get('maxHeight')}px` : undefined,
      width: urlParams.get('width') ? `${urlParams.get('width')}px` : undefined,
      height: urlParams.get('height') ? `${urlParams.get('height')}px` : undefined,
    },
  });
};

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

// Spaced out from the next block, the same way as the admonitions of the markdown
export const Reminder: React.FC<ReminderProps> = ({ className, ...props }) => (
  <ReminderBase className={cn('mb-xs', className)} {...props} />
);

/**
 * The only components an MDX content can use: any other one fails the compilation of the content,
 * and therefore the validation of the contents. Whatever the markdown already renders (quotes, code, mermaid
 * diagrams) is written in markdown, the same way as in a `.md` content.
 */
export const mdxComponents = {
  Figure,
  Reminder,
};
