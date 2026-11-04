import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { Heading } from '@/design-system/ui/heading';
import { Separator } from '@/design-system/ui/separator';
import { Text } from '@/design-system/ui/text';

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
 * Sommaire d'un article ou d'un tutoriel : un lien par section, la section en cours ressortant en bleu.
 *
 * Les pages d'article ne sont pas hydratées : le serveur rend l'état de chaque section (`aria-current` pour la section
 * en cours, `summary-card-link-past` pour les passées, `data-state` pour le script), que `src/helpers/summaryHelper.ts`
 * met à jour pendant la lecture. Les couleurs en découlent en CSS (`summary-card.css`).
 */
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
    <div className={cn('card p-6', variant === 'secondary' && 'summary-card-secondary', className)}>
      {withTitle && (
        <Heading size="m" className="text-brand">
          {title}
        </Heading>
      )}
      <div className={cn('flex flex-col', withTitle && 'mt-6')}>
        {sections.map(({ name, label, ...link }, index) => {
          const state = getSummarySectionState(index, activeIndex);

          return (
            <React.Fragment key={index}>
              <a
                {...link}
                data-summary-link={name}
                data-summary-label={label}
                data-state={state}
                aria-current={state === 'active' ? 'location' : undefined}
                className={cn('summary-card-link', state === 'past' && 'summary-card-link-past')}
              >
                <Text className={variant === 'primary' ? 'text-primary' : undefined}>
                  {variant === 'secondary' ? index + 1 : '•'}
                </Text>
                <Text>{label}</Text>
              </a>
              {index !== sections.length - 1 && <Separator className="my-2" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
