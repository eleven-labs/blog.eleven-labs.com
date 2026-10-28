import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { Link, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface AuthorCardProps {
  name: string;
  description: React.ReactNode;
  avatarImageUrl?: string;
  link: { label: string } & ComponentPropsWithoutRef<'a'>;
  className?: string;
}

const avatarClassName = 'size-[72px] rounded-[50px]';

export const AuthorCard: React.FC<AuthorCardProps> = ({
  name,
  avatarImageUrl,
  description,
  link: { label: linkLabel, ...link },
  className,
}) => (
  <div className={cn('relative flex items-center gap-4 rounded-card bg-surface px-4 py-6', className)}>
    {avatarImageUrl ? (
      <img src={avatarImageUrl} alt={name} className={avatarClassName} />
    ) : (
      <div className={cn(avatarClassName, 'bg-[url(/imgs/astronaut.png)] bg-cover bg-no-repeat')} />
    )}
    <div className="flex flex-1 flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <Text size="m" className="font-semibold text-brand">
          {name}
        </Text>
        <Text render={<div />} size="xs" className="mt-1 italic">
          {description}
        </Text>
      </div>
      {/* Le lien couvre toute la carte, qui devient ainsi cliquable d'un bout à l'autre. */}
      <Link
        {...link}
        data-internal-link="author"
        className="px-0 font-display tracking-wider uppercase before:absolute before:inset-0 before:z-1 before:content-['_'] md:px-6"
      >
        {linkLabel}
      </Link>
    </div>
  </div>
);
