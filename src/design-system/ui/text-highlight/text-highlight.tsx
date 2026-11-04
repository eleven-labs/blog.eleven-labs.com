import type { TextProps } from '@/design-system/ui/text';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import * as React from 'react';

import { Text } from '@/design-system/ui/text';

export interface TextHighlightProps extends TextProps {
  text: string;
  /** Portion du texte à mettre en avant, en général la saisie de l'utilisateur. */
  textQuery?: string;
}

/** Texte dont les occurrences de la saisie sont mises en avant (couleur primaire, graisse moyenne). */
export const TextHighlight: React.FC<TextHighlightProps> = ({ text, textQuery = '', ...props }) => {
  const parts = React.useMemo(() => {
    const matches = match(text, textQuery, { findAllOccurrences: true });
    return parse(text, matches);
  }, [text, textQuery]);

  return (
    <Text {...props}>
      {parts.map((part, index) => (
        <span key={index} className={part.highlight ? 'font-medium text-primary' : 'font-normal text-ink'}>
          {part.text}
        </span>
      ))}
    </Text>
  );
};
