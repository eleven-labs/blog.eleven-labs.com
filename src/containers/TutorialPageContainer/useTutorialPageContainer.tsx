import type { PostPageProps } from '@/pages';
import type { TutorialPageData } from '@/types';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { MARKDOWN_CONTENT_TYPES } from '@/constants';
import { Button } from '@/design-system';
import { usePostPage } from '@/hooks/usePostPage';

import { scrollToSection, useActiveSection } from './useActiveSection';

export const useTutorialPageContainer = (tutorial: TutorialPageData): PostPageProps => {
  const { t } = useTranslation();
  const postPageProps = usePostPage(tutorial);
  const activeStepSlug = useActiveSection(tutorial.steps.map((step) => step.slug));

  const getStepLink = (step: TutorialPageData['steps'][number]): React.ComponentPropsWithoutRef<'a'> => ({
    href: `#${step.slug}`,
    onClick: (event) => scrollToSection(event, step.slug),
  });

  return {
    variant: MARKDOWN_CONTENT_TYPES.TUTORIAL,
    ...postPageProps,
    summary: {
      title: t('pages.tutorial.summary_card.title'),
      sections: tutorial.steps.map((step) => ({
        name: step.slug,
        label: step.title,
        ...getStepLink(step),
      })),
      sectionActive: activeStepSlug,
    },
    // Every step is in the HTML served, the navigation only moves from one section to another
    children: tutorial.steps.map((step, index) => {
      const previousStep = tutorial.steps[index - 1];
      const nextStep = tutorial.steps[index + 1];

      return (
        <section key={step.slug} id={step.slug} className="scroll-mt-m">
          <h2>{step.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: step.content }} />
          {(previousStep || nextStep) && (
            <div className="flex gap-l">
              {previousStep && (
                <Button render={<a {...getStepLink(previousStep)} />} className="mt-l" variant="secondary">
                  {t('pages.tutorial.previous_button')}
                </Button>
              )}
              {nextStep && (
                <Button render={<a {...getStepLink(nextStep)} />} className="mt-l">
                  {t('pages.tutorial.next_button')}
                </Button>
              )}
            </div>
          )}
        </section>
      );
    }),
  };
};
