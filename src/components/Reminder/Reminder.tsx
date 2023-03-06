import './Reminder.scss';

import { Box, BoxProps, Text } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

export const reminderVariantList = [
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

export type ReminderVariantType = (typeof reminderVariantList)[number];

export type ReminderOptions = {
  variant: ReminderVariantType;
  title: React.ReactNode;
};
export type ReminderProps = BoxProps & ReminderOptions;

export const Reminder: React.FC<ReminderProps> = ({ variant, title, children, ...nativeProps }) => (
  <Box {...nativeProps} className={classNames('reminder', `reminder--${variant}`)}>
    <Text className="reminder__title">{title}</Text>
    <Box p="xxs">{children}</Box>
  </Box>
);
