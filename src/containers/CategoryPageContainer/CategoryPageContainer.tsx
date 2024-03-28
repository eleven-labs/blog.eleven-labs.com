import { CategoryPage } from '@eleven-labs/design-system';
import React from 'react';

import { useCategoryPageContainer } from './useCategoryPageContainer';

export const CategoryPageContainer: React.FC = () => {
  const postListPageProps = useCategoryPageContainer();
  return <CategoryPage {...postListPageProps} />;
};
