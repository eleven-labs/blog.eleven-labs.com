import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { Divider, Heading, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export const SummaryCardVariant = ['primary', 'secondary'] as const;
export type SummaryCardVariantType = (typeof SummaryCardVariant)[number];

export interface SummaryCardProps {
  variant?: SummaryCardVariantType;
  title: string;
  sectionActive?: string;
  sections: ({ name: string; label: string } & ComponentPropsWithoutRef<'a'>)[];
  className?: string;
}

/**
 * Dans la déclinaison `secondary` le sommaire se lit comme une progression : ce qui reste à lire
 * est en noir, ce qui est déjà passé en gris, et l'étape en cours ressort en bleu.
 */
const getSectionColorClassName = (variant: SummaryCardVariantType, index: number, activeIndex: number): string => {
  if (variant === 'primary') {
    return 'text-black';
  }

  if (activeIndex === -1 || index < activeIndex) {
    return 'text-grey';
  }

  return index === activeIndex ? 'text-primary' : 'text-black';
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
  variant = 'primary',
  title,
  sectionActive,
  sections,
  className,
}) => {
  const activeIndex = sections.findIndex(({ name }) => name === sectionActive);

  return (
    <div className={cn('rounded-xs bg-white p-m', className)}>
      <Heading size="m" className="text-primary">
        {title}
      </Heading>
      <div className="mt-m flex flex-col">
        {sections.map(({ name: _name, label, ...link }, index) => (
          <React.Fragment key={index}>
            <a {...link} className={cn('flex gap-s font-semibold', getSectionColorClassName(variant, index, activeIndex))}>
              <Text className={variant === 'primary' ? 'text-info' : undefined}>
                {variant === 'secondary' ? index + 1 : '•'}
              </Text>
              <Text>{label}</Text>
            </a>
            {index !== sections.length - 1 && <Divider className="my-xxs" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
