import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { PATHS } from '@/constants';
import { generatePath } from '@/helpers/routerHelper';
import { usePostPage } from '@/hooks/usePostPage';
import { TutorialPageProps } from '@/pages/TutorialPage';
import { TutorialPageData } from '@/types';

export const useTutorialPageContainer = (tutorial: TutorialPageData): TutorialPageProps => {
  const { t, i18n } = useTranslation();
  const postPageProps = usePostPage(tutorial);
  const { slug, step: currentStep } = useParams<{ slug: string; step: string }>();

  const [currentTutorialStepIndex, currentTutorialStep] = Object.entries(tutorial.steps).find(
    ([, step]) => step.slug === currentStep
  ) ?? [0, tutorial.steps[0]];
  const previousStep = tutorial.steps[Number(currentTutorialStepIndex) - 1];
  const nextStep = tutorial.steps[Number(currentTutorialStepIndex) + 1];

  return {
    contentType: tutorial.contentType,
    ...postPageProps,
    steps: tutorial.steps.map((step, index) => ({
      name: step.slug,
      label: step.title,
      href: generatePath(PATHS.POST, { lang: i18n.language, slug, step: index > 0 ? step.slug : undefined }),
    })),
    stepActive: currentTutorialStep?.slug ?? tutorial.steps[0].slug,
    content: currentTutorialStep?.content ?? tutorial.steps[0].content,
    previousLink: previousStep
      ? {
          label: t('pages.tutorial.previous_button'),
          href: generatePath(PATHS.POST, { lang: i18n.language, slug, step: previousStep.slug }),
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
