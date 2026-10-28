import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { Link } from '@/design-system/ui/link';
import { Text } from '@/design-system/ui/text';

export interface AuthorCardProps {
  name: string;
  description: React.ReactNode;
  avatarImageUrl?: string;
  link: { label: string } & ComponentPropsWithoutRef<'a'>;
  className?: string;
}

/** Carte d'un auteur : avatar, nom, description et lien vers son profil, cliquable sur toute sa surface. */
export const AuthorCard: React.FC<AuthorCardProps> = ({
  name,
  avatarImageUrl,
  description,
  link: { label: linkLabel, ...link },
  className,
}) => (
  <div className={cn('card flex items-center gap-4 px-4 py-6', className)}>
    {avatarImageUrl ? (
      <img src={avatarImageUrl} alt={name} className="author-card-avatar" />
    ) : (
      <div aria-hidden="true" className="author-card-avatar author-card-avatar-default" />
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
      <Link
        {...link}
        data-internal-link="author"
        className="card-stretched-link px-0 font-display tracking-wider uppercase md:px-6"
      >
        {linkLabel}
      </Link>
    </div>
  </div>
);
