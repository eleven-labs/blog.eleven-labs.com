import type { TutorialPageData } from '@/types';

import React from 'react';

import { PostPage } from '@/pages';

import { useTutorialPageContainer } from './useTutorialPageContainer';

export const TutorialPageContainer: React.FC<{ tutorial: TutorialPageData }> = ({ tutorial }) => {
  const tutorialPageProps = useTutorialPageContainer(tutorial);

  return <PostPage {...tutorialPageProps} />;
};
