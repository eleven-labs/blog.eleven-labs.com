import type { TransProps } from 'react-i18next';

import React from 'react';
import { Trans } from 'react-i18next';

import { Link, Text } from '@/design-system';

export interface TransWithHtmlProps extends Pick<TransProps<string>, 'i18nKey' | 'values'> {
  onlyLineBreak?: boolean;
}

export const TransWithHtml: React.FC<TransWithHtmlProps> = ({ i18nKey, values, onlyLineBreak }) => (
  <Trans
    i18nKey={i18nKey}
    values={values}
    components={{
      br: <br />,
      ...(onlyLineBreak ? {} : { strong: <Text render={<strong />} />, em: <Text render={<em />} className="italic" />, a: <Link /> }),
    }}
  />
);
