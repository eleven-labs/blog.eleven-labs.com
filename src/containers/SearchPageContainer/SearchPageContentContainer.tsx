import { SearchPageContent } from '@eleven-labs/design-system';
import React from 'react';

import { useSearchPageContentContainer } from './useSearchPageContentContainer';

export const SearchPageContentContainer: React.FC = () => {
  const searchPageContent = useSearchPageContentContainer();
  return <SearchPageContent {...searchPageContent} />;
};
