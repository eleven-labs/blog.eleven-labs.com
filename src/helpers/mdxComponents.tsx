import type { ComponentPropsWithoutRef, ReminderProps } from '@/design-system';

import React from 'react';

import { Reminder as ReminderBase } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface FigureProps extends ComponentPropsWithoutRef<'figure'> {
  src: string;
  alt: string;
  caption?: React.ReactNode;
}

export const Figure: React.FC<FigureProps> = ({ src, alt, caption, children, ...props }) => (
  <figure {...props}>
    <img src={src} alt={alt} loading="lazy" decoding="async" />
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
