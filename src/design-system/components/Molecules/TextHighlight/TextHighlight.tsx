import type { TextProps } from '@/design-system';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import * as React from 'react';

import { Text } from '@/design-system';
import { polyRef } from '@/design-system/helpers/polyRef';

export interface TextHighlightProps extends TextProps {
  text: string;
  textQuery?: string;
}

export const TextHighlight = polyRef<'p', TextHighlightProps>(({ text, textQuery = '', ...props }, ref) => {
  const parts = React.useMemo(() => {
    const matches = match(text, textQuery, { findAllOccurrences: true });
    return parse(text, matches);
  }, [text, textQuery]);

  return (
    <Text {...props} ref={ref}>
      {parts.map((part, index) => (
        <span key={index} className={part.highlight ? 'font-medium text-info' : 'font-normal text-black'}>
          {part.text}
        </span>
      ))}
    </Text>
  );
});

TextHighlight.displayName = 'TextHighlight';
