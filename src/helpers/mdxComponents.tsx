import type { ComponentPropsWithoutRef } from '@/design-system';

import React from 'react';

import { Blockquote, Reminder, SyntaxHighlighter } from '@/design-system';

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

export interface MermaidProps {
  chart?: string;
  children?: React.ReactNode;
}

// Rendered by mermaid on the client, the same way as a ```mermaid code fence
export const Mermaid: React.FC<MermaidProps> = ({ chart, children }) => (
  <pre className="mermaid flex items-center justify-center">{chart ?? children}</pre>
);

/**
 * The only components an MDX content can use: any other one fails the compilation of the content,
 * and therefore the validation of the contents.
 */
export const mdxComponents = {
  Blockquote,
  Figure,
  Mermaid,
  Reminder,
  SyntaxHighlighter,
};
