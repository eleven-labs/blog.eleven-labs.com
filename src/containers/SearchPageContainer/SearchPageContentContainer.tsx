import React from 'react';

import { SearchPageContent } from '@/pages';

import { useSearchPageContentContainer } from './useSearchPageContentContainer';

export const SearchPageContentContainer: React.FC = () => {
  const searchPageContent = useSearchPageContentContainer();
  return <SearchPageContent {...searchPageContent} />;
};
