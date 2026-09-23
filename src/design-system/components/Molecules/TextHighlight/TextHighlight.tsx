import type { TextOwnProps, TextProps } from '@/design-system';
import type { ElementTagName, PolymorphicProps } from '@/design-system/types';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import * as React from 'react';

import { Text } from '@/design-system';

export interface TextHighlightOwnProps extends TextOwnProps {
  text: string;
  /** Portion du texte à mettre en avant, en général la saisie de l'utilisateur. */
  textQuery?: string;
}

export type TextHighlightProps<TTagName extends ElementTagName = 'p'> = PolymorphicProps<
  TTagName,
  TextHighlightOwnProps
>;

export const TextHighlight = <TTagName extends ElementTagName = 'p'>({
  text,
  textQuery = '',
  ...props
}: TextHighlightProps<TTagName>): React.JSX.Element => {
  const parts = React.useMemo(() => {
    const matches = match(text, textQuery, { findAllOccurrences: true });
    return parse(text, matches);
  }, [text, textQuery]);

  return (
    <Text {...(props as unknown as TextProps<TTagName>)}>
      {parts.map((part, index) => (
        <span key={index} className={part.highlight ? 'font-medium text-info' : 'font-normal text-black'}>
          {part.text}
        </span>
      ))}
    </Text>
  );
};
