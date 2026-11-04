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
  <div
    {...props}
    className={cn('container-content my-10 flex flex-col gap-10 md:grid md:grid-cols-content-aside', className)}
  >
    {/* La colonne latérale occupe 30 % de la largeur, le contenu le reste, gouttière déduite. */}
    <main className="flex flex-col gap-10">{content}</main>
    <aside className="flex flex-col gap-10">{sidebar}</aside>
  </div>
);
