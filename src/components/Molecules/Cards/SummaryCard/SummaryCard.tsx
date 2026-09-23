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
  /** Le titre peut être porté par le composant qui englobe la carte. */
  withTitle?: boolean;
  className?: string;
}

export type SummarySectionStateType = 'past' | 'active' | 'upcoming';

export const getSummarySectionState = (index: number, activeIndex: number): SummarySectionStateType => {
  if (activeIndex === -1 || index < activeIndex) {
    return 'past';
  }

  return index === activeIndex ? 'active' : 'upcoming';
};

/**
 * La section en cours ressort en bleu. Dans la déclinaison `secondary` le sommaire se lit en plus comme
 * une progression : ce qui reste à lire est en noir, ce qui est déjà passé en gris.
 *
 * Les pages d'article ne sont pas hydratées : le serveur rend l'état de chaque section dans `data-state`,
 * que `src/helpers/summaryHelper.ts` met à jour pendant la lecture. Les couleurs en découlent en CSS.
 */
const sectionColorClassNames: Record<SummaryCardVariantType, string> = {
  primary: 'text-black data-[state=active]:text-primary',
  secondary: 'text-black data-[state=active]:text-primary data-[state=past]:text-grey',
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
  variant = 'primary',
  title,
  sectionActive,
  sections,
  withTitle = true,
  className,
}) => {
  const activeIndex = sections.findIndex(({ name }) => name === sectionActive);

  return (
    <div className={cn('rounded-xs bg-white p-m', className)}>
      {withTitle && (
        <Heading size="m" className="text-primary">
          {title}
        </Heading>
      )}
      <div className={cn('flex flex-col', withTitle && 'mt-m')}>
        {sections.map(({ name, label, ...link }, index) => (
          <React.Fragment key={index}>
            <a
              {...link}
              data-summary-link={name}
              data-summary-label={label}
              data-state={getSummarySectionState(index, activeIndex)}
              className={cn('flex gap-s font-semibold', sectionColorClassNames[variant])}
            >
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
