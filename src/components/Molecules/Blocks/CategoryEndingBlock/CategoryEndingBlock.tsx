import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { Button, Text } from '@/design-system';

export interface CategoryEndingBlockProps {
  title: React.ReactNode;
  description: React.ReactNode;
  expertiseLink?: { label: string } & ComponentPropsWithoutRef<'a'>;
  className?: string;
}

export const CategoryEndingBlock: React.FC<CategoryEndingBlockProps> = ({
  title,
  description,
  expertiseLink: { label: expertiseLinkLabel, ...expertiseLink } = {},
  className,
}) => (
  <div className={className}>
    <Text size="m" className="font-bold">
      {title}
    </Text>
    <Text className="mt-m">{description}</Text>
    {expertiseLinkLabel && (
      <Button render={<a {...expertiseLink} />} className="mt-l">
        {expertiseLinkLabel}
      </Button>
    )}
  </div>
);
