import './Reminder.scss';

import { Box, BoxProps, Text } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

export const variantReminderList = [
  'note',
  'summary',
  'info',
  'tip',
  'success',
  'question',
  'warning',
  'failure',
  'danger',
  'bug',
  'example',
  'quote',
] as const;

export type VariantReminderType = (typeof variantReminderList)[number];

export type ReminderOptions = {
  variant: VariantReminderType;
  title: string;
};
export type ReminderProps = BoxProps & ReminderOptions;

export const Reminder: React.FC<ReminderProps> = ({ variant, title, children, ...nativeProps }) => (
  <Box {...nativeProps} className={classNames('reminder', `reminder--${variant}`)} size={{ xs: 's', md: 'm' }}>
    <Text className="reminder__title" p="xxs">
      {title}
    </Text>
    <Text p="xxs">{children}</Text>
  </Box>
);
