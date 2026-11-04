import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { Button } from '@/design-system/ui/button';
import { Text } from '@/design-system/ui/text';

export interface CategoryEndingBlockProps {
  title: React.ReactNode;
  description: React.ReactNode;
  expertiseLink?: { label: string } & ComponentPropsWithoutRef<'a'>;
  className?: string;
}

/** Conclusion d'une page de catégorie : un titre, un texte d'accompagnement et un lien vers l'expertise associée. */
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
    <Text className="mt-6">{description}</Text>
    {expertiseLinkLabel && (
      <Button render={<a {...expertiseLink} />} className="mt-8">
        {expertiseLinkLabel}
      </Button>
    )}
  </div>
);
