import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { Button } from '@/design-system/ui/button';
import { Heading } from '@/design-system/ui/heading';
import { Text } from '@/design-system/ui/text';

export type ContactCardProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  link: { label: React.ReactNode } & ComponentPropsWithoutRef<'a'>;
  className?: string;
};

/** Carte d'appel à contacter l'équipe : titre, description et bouton lien. */
export const ContactCard: React.FC<ContactCardProps> = ({
  title,
  description,
  link: { label: linkLabel, ...link },
  className,
}) => (
  <div className={cn('card contact-card', className)}>
    <div className="contact-card-content">
      <Heading size="l" className="text-brand">
        {title}
      </Heading>
      <Text size="s">{description}</Text>
      <Button render={<a {...link} />}>{linkLabel}</Button>
    </div>
  </div>
);
