import React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { Heading } from '@/design-system/ui/heading';
import { Text } from '@/design-system/ui/text';

export type NotFoundBlockOptions = {
  title: React.ReactNode;
  description: React.ReactNode;
};

export type NotFoundBlockProps = NotFoundBlockOptions & { className?: string };

/** Message « aucun résultat » : une illustration, un titre et une consigne pour réessayer. */
export const NotFoundBlock: React.FC<NotFoundBlockProps> = ({ title, description, className }) => (
  <div className={cn('flex flex-col items-center', className)}>
    <div className="not-found-picture" aria-hidden="true" />
    <Heading size="xl" className="mt-4">
      {title}
    </Heading>
    <Text size="s" className="mt-2">
      {description}
    </Text>
  </div>
);
