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

/** Encart « admonition » du markdown (note, astuce, avertissement…) : un titre avec icône et un contenu. */
export const Reminder: React.FC<ReminderProps> = ({ variant, title, className, children, ...props }) => (
  <div
    {...props}
    // La couleur et l'icône de la variante sont portées par `reminder.css`.
    className={cn('reminder', `reminder--${variant}`, className)}
  >
    <p className="reminder-title">{title}</p>
    <div className="reminder-content">{children}</div>
  </div>
);
