import { Link, Text } from '@eleven-labs/design-system';
import React from 'react';
import { Trans, TransProps } from 'react-i18next';

export interface TransWithHtmlProps extends Pick<TransProps<string>, 'i18nKey' | 'values'> {
  onlyLineBreak?: boolean;
}

export const TransWithHtml: React.FC<TransWithHtmlProps> = ({ i18nKey, values, onlyLineBreak }) => (
  <Trans
    i18nKey={i18nKey}
    values={values}
    components={{
      br: <br />,
      ...(onlyLineBreak ? {} : { strong: <Text as="strong" />, em: <Text as="em" italic />, a: <Link /> }),
    }}
  />
);
