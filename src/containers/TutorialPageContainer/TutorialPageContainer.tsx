import type { TutorialPageData } from '@/types';

import { PostPage } from '@eleven-labs/design-system';
import React from 'react';

import { useTutorialPageContainer } from './useTutorialPageContainer';

export const TutorialPageContainer: React.FC<{ tutorial: TutorialPageData }> = ({ tutorial }) => {
  const tutorialPageProps = useTutorialPageContainer(tutorial);

  return <PostPage {...tutorialPageProps} />;
};
