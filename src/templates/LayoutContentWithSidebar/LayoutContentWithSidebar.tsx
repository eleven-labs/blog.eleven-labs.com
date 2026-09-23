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
  <div {...props} className={cn('container-content my-xl flex flex-col gap-xl md:flex-row', className)}>
    {/* Le contenu occupe 70% de la largeur, gouttière déduite ; la colonne latérale le reste. */}
    <main className="flex flex-1 flex-col gap-xl md:w-[calc(70%-var(--spacing-xl))]">{content}</main>
    <aside className="flex flex-col gap-xl md:w-[30%]">{sidebar}</aside>
  </div>
);
