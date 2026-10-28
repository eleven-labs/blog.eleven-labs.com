import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { cn } from '@/design-system/helpers/cn';

export interface LayoutContentWithSidebarProps extends Omit<ComponentPropsWithoutRef<'div'>, 'content'> {
  content: React.ReactNode;
  sidebar: React.ReactNode;
}

export const LayoutContentWithSidebar: React.FC<LayoutContentWithSidebarProps> = ({
  content,
  sidebar,
  className,
  ...props
}) => (
  <div {...props} className={cn('container-content my-10 flex flex-col gap-10 md:flex-row', className)}>
    {/* Le contenu occupe 70% de la largeur, gouttière déduite ; la colonne latérale le reste. */}
    <main className="flex flex-1 flex-col gap-10 md:w-[calc(70%-var(--spacing-10))]">{content}</main>
    <aside className="flex flex-col gap-10 md:w-[30%]">{sidebar}</aside>
  </div>
);
