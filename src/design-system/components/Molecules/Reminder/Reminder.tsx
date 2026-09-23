import type { ComponentPropsWithoutRef } from '@/design-system/types';

import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';

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

export interface ReminderProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  variant: ReminderVariantType;
  title: React.ReactNode;
}

export const Reminder: React.FC<ReminderProps> = ({ variant, title, className, children, ...props }) => (
  <div
    {...props}
    // La couleur et l'icône de la variante sont portées par `Reminder.css`.
    className={cn(
      `reminder--${variant}`,
      'border-l-[0.2rem] border-(--reminder-accent-color) bg-white shadow-[0_2px_2px_0_rgb(0_0_0/14%),0_1px_5px_0_rgb(0_0_0/12%),0_3px_1px_-2px_rgb(0_0_0/20%)]',
      className
    )}
  >
    <p className="reminder-title bg-(--reminder-title-background-color) p-xxs font-bold">{title}</p>
    <div className="p-xxs">{children}</div>
  </div>
);
