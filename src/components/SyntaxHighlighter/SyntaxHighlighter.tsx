import { MarginSystemProps } from '@eleven-labs/design-system';
import React from 'react';
import SyntaxHighlighterBase, { SyntaxHighlighterProps as SyntaxHighlighterBaseProps } from 'react-syntax-highlighter';
import githubGist from 'react-syntax-highlighter/dist/cjs/styles/hljs/github-gist';

export type SyntaxHighlighterProps = MarginSystemProps & Pick<SyntaxHighlighterBaseProps, 'language' | 'children'>;

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ language, children, ...props }) => (
  <SyntaxHighlighterBase
    {...props}
    language={language}
    style={githubGist}
    customStyle={{
      backgroundColor: 'var(--color-ultra-light-grey)',
      padding: 'var(--spacing-s)',
      borderRadius: '4px',
    }}
    PreTag="div"
  >
    {children}
  </SyntaxHighlighterBase>
);
