import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { Button, Heading, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface HomeIntroBlockProps {
  intro: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  elevenLabsLink: { label: string } & ComponentPropsWithoutRef<'a'>;
  className?: string;
}

export const HomeIntroBlock: React.FC<HomeIntroBlockProps> = ({
  intro,
  title,
  description,
  elevenLabsLink: { label: elevelLabsLinkLabel, ...elevenLabsLink },
  className,
}) => (
  <div className={cn('flex bg-surface', className)}>
    <div className="flex flex-1 flex-col items-baseline py-0 max-md:mx-auto max-md:my-10 max-md:max-w-[90vw] md:ml-[5vw] md:py-10">
      <Heading size="s" className="text-primary uppercase">
        {intro}
      </Heading>
      <Heading render={<h1 />} size="xl" className="mt-6 text-brand">
        {title}
      </Heading>
      <Text className="mt-8">{description}</Text>
      <Button render={<a {...elevenLabsLink} />} className="mt-8">
        {elevelLabsLinkLabel}
      </Button>
    </div>
    {/* L'astronaute n'apparaît qu'à partir de `md`, faute de place à côté du texte en dessous. */}
    <div className="flex-1 max-md:hidden md:bg-[url(/imgs/home-intro-block.png)] md:bg-contain md:bg-top-right md:bg-no-repeat" />
  </div>
);
