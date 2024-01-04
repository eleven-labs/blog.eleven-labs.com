import React from 'react';

import { CategoryPage } from '@/pages';

import { useCategoryPageContainer } from './useCategoryPageContainer';

export const CategoryPageContainer: React.FC = () => {
  const postListPageProps = useCategoryPageContainer();
  return <CategoryPage {...postListPageProps} />;
};
