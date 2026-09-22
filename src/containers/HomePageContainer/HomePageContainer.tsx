import React from 'react';

import { HomePage } from '@/pages';

import { useHomePageContainer } from './useHomePageContainer';

export const HomePageContainer: React.FC = () => {
  const homePage = useHomePageContainer();
  return <HomePage {...homePage} />;
};
