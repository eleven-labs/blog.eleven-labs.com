import type { SummaryCardProps } from '@/components/summary-card';

import React from 'react';

import { SummaryCard } from '@/components/summary-card';
import { cn } from '@/design-system/helpers/cn';
import { Icon } from '@/design-system/ui/icon';
import { Text } from '@/design-system/ui/text';

export type SummaryBarProps = SummaryCardProps;

/**
 * Sommaire des petits écrans : une barre collée en haut de l'écran pendant la lecture, sous l'en-tête quand il est affiché, qui rappelle
 * la section en cours et, dans la déclinaison `secondary`, la progression dans le tutoriel.
 * Elle déplie la liste des sections ; reposant sur `<details>`, elle s'ouvre aussi sans JavaScript.
 *
 * Le serveur rend la première section ; `src/helpers/summaryHelper.ts` tient ensuite à jour les éléments
 * marqués `data-summary-bar-*` pendant la lecture.
 */
export const SummaryBar: React.FC<SummaryBarProps> = ({
  variant = 'primary',
  title,
  sections,
  sectionActive,
  className,
}) => {
  const activeIndex = Math.max(
    0,
    sections.findIndex(({ name }) => name === sectionActive)
  );
  const activeSection = sections[activeIndex];

  if (!activeSection) {
    return null;
  }

  return (
    <details data-summary-bar={variant} className={cn('summary-bar', className)}>
      <summary className="summary-bar-header">
        <span className="flex min-w-0 flex-1 flex-col">
          <Text render={<span />} size="xs" className="font-semibold text-brand">
            {title}
            {variant === 'secondary' && (
              <>
                {' · '}
                <span data-summary-bar-index>{activeIndex + 1}</span>/{sections.length}
              </>
            )}
          </Text>
          <Text render={<span />} className="truncate font-semibold" data-summary-bar-label>
            {activeSection.label}
          </Text>
        </span>
        <Icon name="arrow" className="summary-bar-chevron" aria-hidden="true" />
        {/* Dans le `<summary>`, seul à rester affiché quand la liste est repliée */}
        {variant === 'secondary' && (
          <span className="summary-bar-track" aria-hidden="true">
            <span
              data-summary-bar-progress
              className="summary-bar-progress"
              style={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }}
            />
          </span>
        )}
      </summary>
      <SummaryCard
        variant={variant}
        title={title}
        sectionActive={activeSection.name}
        sections={sections}
        withTitle={false}
        className="summary-bar-list"
      />
    </details>
  );
};
