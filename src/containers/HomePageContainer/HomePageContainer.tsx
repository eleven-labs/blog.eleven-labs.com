import { HomePage } from '@eleven-labs/design-system';
import React from 'react';

import { useHomePageContainer } from './useHomePageContainer';

export const HomePageContainer: React.FC = () => {
  const homePage = useHomePageContainer();
  return <HomePage {...homePage} />;
};
