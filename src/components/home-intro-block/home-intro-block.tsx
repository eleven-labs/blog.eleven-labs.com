import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { Button } from '@/design-system/ui/button';
import { Heading } from '@/design-system/ui/heading';
import { Text } from '@/design-system/ui/text';

export interface HomeIntroBlockProps {
  intro: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  elevenLabsLink: { label: string } & ComponentPropsWithoutRef<'a'>;
  className?: string;
}

/** Introduction de la page d'accueil : accroche, titre de niveau 1, présentation du blog et lien vers Eleven Labs. */
export const HomeIntroBlock: React.FC<HomeIntroBlockProps> = ({
  intro,
  title,
  description,
  elevenLabsLink: { label: elevenLabsLinkLabel, ...elevenLabsLink },
  className,
}) => (
  <div className={cn('flex bg-surface', className)}>
    <div className="home-intro-text">
      <Heading size="s" className="text-primary uppercase">
        {intro}
      </Heading>
      <Heading render={<h1 />} size="xl" className="mt-6 text-brand">
        {title}
      </Heading>
      <Text className="mt-8">{description}</Text>
      <Button render={<a {...elevenLabsLink} />} className="mt-8">
        {elevenLabsLinkLabel}
      </Button>
    </div>
    <div className="home-intro-picture" aria-hidden="true" />
  </div>
);
