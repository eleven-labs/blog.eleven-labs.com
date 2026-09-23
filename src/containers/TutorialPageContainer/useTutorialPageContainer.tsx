import type { PostPageProps } from '@/pages';
import type { TutorialPageData } from '@/types';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { MARKDOWN_CONTENT_TYPES } from '@/constants';
import { Button } from '@/design-system';
import { usePostPage } from '@/hooks/usePostPage';

export const useTutorialPageContainer = (tutorial: TutorialPageData): PostPageProps => {
  const { t } = useTranslation();
  const postPageProps = usePostPage(tutorial);

  const getStepLink = (step: TutorialPageData['steps'][number]): React.ComponentPropsWithoutRef<'a'> => ({
    href: `#${step.slug}`,
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
      sectionActive: tutorial.steps[0]?.slug,
    },
    // Every step is in the HTML served, but the reader only sees one at a time: see `[data-tutorial-steps]`
    // in PostContent.css. The navigation moves from one step to another through their anchors.
    children: (
      <div data-tutorial-steps>
        {tutorial.steps.map((step, index) => {
          const previousStep = tutorial.steps[index - 1];
          const nextStep = tutorial.steps[index + 1];

          return (
            <section key={step.slug} id={step.slug}>
              <h2>{step.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: step.content }} />
              {(previousStep || nextStep) && (
                <div data-tutorial-step-nav className="gap-l">
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
        })}
      </div>
    ),
  };
};
