import type { SummaryCardProps } from '@/components/Molecules/Cards/SummaryCard';

import React from 'react';

import { SummaryCard } from '@/components/Molecules/Cards/SummaryCard';
import { Icon, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

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
    <details
      data-summary-bar={variant}
      className={cn('group sticky top-(--sticky-header-offset,0px) z-5 overflow-hidden rounded-xs bg-white shadow-md transition-[top]', className)}
    >
      <summary className="relative flex cursor-pointer list-none items-center gap-s px-m py-s [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 flex-1 flex-col">
          <Text render={<span />} size="xs" className="font-semibold text-primary">
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
        <Icon name="arrow" className="shrink-0 rotate-90 text-primary transition-transform group-open:-rotate-90" />
        {/* Dans le `<summary>`, seul à rester affiché quand la liste est repliée */}
        {variant === 'secondary' && (
          <span className="absolute inset-x-0 bottom-0 block h-[3px] bg-ultra-light-grey" aria-hidden="true">
            <span
              data-summary-bar-progress
              className="block h-full bg-primary transition-[width]"
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
        className="max-h-[60vh] overflow-y-auto"
      />
    </details>
  );
};
