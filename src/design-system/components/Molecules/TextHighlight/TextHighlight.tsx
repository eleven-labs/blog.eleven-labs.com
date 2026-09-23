import type { TextProps } from '@/design-system';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import * as React from 'react';

import { Text } from '@/design-system';

export interface TextHighlightProps extends TextProps {
  text: string;
  /** Portion du texte à mettre en avant, en général la saisie de l'utilisateur. */
  textQuery?: string;
}

export const TextHighlight: React.FC<TextHighlightProps> = ({ text, textQuery = '', ...props }) => {
  const parts = React.useMemo(() => {
    const matches = match(text, textQuery, { findAllOccurrences: true });
    return parse(text, matches);
  }, [text, textQuery]);

  return (
    <Text {...props}>
      {parts.map((part, index) => (
        <span key={index} className={part.highlight ? 'font-medium text-info' : 'font-normal text-black'}>
          {part.text}
        </span>
      ))}
    </Text>
  );
};
