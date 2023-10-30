import React from 'react';

import { TutorialPage } from '@/pages/TutorialPage';
import { TutorialPageData } from '@/types';

import { useTutorialPageContainer } from './useTutorialPageContainer';

export const TutorialPageContainer: React.FC<{ tutorial: TutorialPageData }> = ({ tutorial }) => {
  const tutorialPageProps = useTutorialPageContainer(tutorial);

  return <TutorialPage {...tutorialPageProps} />;
};
