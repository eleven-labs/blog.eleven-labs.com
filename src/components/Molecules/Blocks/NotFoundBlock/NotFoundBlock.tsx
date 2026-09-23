import React from 'react';

import { Heading, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export type NotFoundBlockOptions = {
  title: React.ReactNode;
  description: React.ReactNode;
};

export type NotFoundBlockProps = NotFoundBlockOptions & { className?: string };

export const NotFoundBlock: React.FC<NotFoundBlockProps> = ({ title, description, className }) => (
  <div className={cn('flex flex-col items-center', className)}>
    <div className="h-[135px] w-full bg-[url(/imgs/not-found.png)] bg-center bg-no-repeat" />
    <Heading size="xl" className="mt-s">
      {title}
    </Heading>
    <Text size="s" className="mt-xxs">
      {description}
    </Text>
  </div>
);
