import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { Button, Heading, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export type ContactCardProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  link: { label: React.ReactNode } & ComponentPropsWithoutRef<'a'>;
  className?: string;
};

export const ContactCard: React.FC<ContactCardProps> = ({
  title,
  description,
  link: { label: linkLabel, ...link },
  className,
}) => (
  <div
    className={cn(
      'flex items-center justify-center rounded-xs bg-white bg-[url(/imgs/contact-background.png)] bg-contain bg-bottom-right bg-no-repeat py-l',
      className
    )}
  >
    <div className="flex max-w-140 flex-col items-center justify-center gap-m px-m text-center">
      <Heading size="l" className="text-primary">
        {title}
      </Heading>
      <Text size="s">{description}</Text>
      <Button render={<a {...link} />}>
        {linkLabel}
      </Button>
    </div>
  </div>
);
