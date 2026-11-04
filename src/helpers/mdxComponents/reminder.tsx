import type { ReminderProps } from '@/design-system/ui/reminder';

import React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { Reminder as ReminderBase } from '@/design-system/ui/reminder';

// Spaced out from the next block, the same way as the admonitions of the markdown
export const Reminder: React.FC<ReminderProps> = ({ className, ...props }) => (
  <ReminderBase className={cn('mb-3', className)} {...props} />
);
