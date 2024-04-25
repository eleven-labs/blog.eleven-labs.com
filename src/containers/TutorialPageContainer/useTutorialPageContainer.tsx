import { Box, PostPageProps } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { MARKDOWN_CONTENT_TYPES, PATHS } from '@/constants';
import { generatePath } from '@/helpers/routerHelper';
import { usePostPage } from '@/hooks/usePostPage';
import { TutorialPageData } from '@/types';

export const useTutorialPageContainer = (tutorial: TutorialPageData): PostPageProps => {
  const { t, i18n } = useTranslation();
  const postPageProps = usePostPage(tutorial);
  const { slug, step: currentStep } = useParams<{ slug: string; step: string }>();

  const firstStep = tutorial.steps[0];
  const [currentTutorialStepIndex, currentTutorialStep] = Object.entries(tutorial.steps).find(
    ([, step]) => step.slug === currentStep
  ) ?? [0, firstStep];
  const previousStep = tutorial.steps[Number(currentTutorialStepIndex) - 1];
  const nextStep = tutorial.steps[Number(currentTutorialStepIndex) + 1];

  return {
    variant: MARKDOWN_CONTENT_TYPES.TUTORIAL,
    ...postPageProps,
    summary: {
      title: t('pages.tutorial.summary_card.title'),
      sections: tutorial.steps.map((step, index) => ({
        name: step.slug,
        label: step.title,
        href: generatePath(PATHS.POST, { lang: i18n.language, slug, step: index > 0 ? step.slug : undefined }),
      })),
      sectionActive: currentTutorialStep?.slug ?? firstStep.slug,
    },
    children: <Box dangerouslySetInnerHTML={{ __html: currentTutorialStep?.content ?? tutorial.steps[0].content }} />,
    previousLink: previousStep
      ? {
          label: t('pages.tutorial.previous_button'),
          href: generatePath(PATHS.POST, {
            lang: i18n.language,
            slug,
            step: previousStep.slug !== firstStep.slug ? previousStep.slug : undefined,
          }),
        }
      : undefined,
    nextLink: nextStep
      ? {
          label: t('pages.tutorial.next_button'),
          href: generatePath(PATHS.POST, { lang: i18n.language, slug, step: nextStep.slug }),
        }
      : undefined,
  };
};
