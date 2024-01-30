import { PostPage } from '@eleven-labs/design-system';
import React from 'react';

import { TutorialPageData } from '@/types';

import { useTutorialPageContainer } from './useTutorialPageContainer';

export const TutorialPageContainer: React.FC<{ tutorial: TutorialPageData }> = ({ tutorial }) => {
  const tutorialPageProps = useTutorialPageContainer(tutorial);

  return <PostPage {...tutorialPageProps} />;
};
