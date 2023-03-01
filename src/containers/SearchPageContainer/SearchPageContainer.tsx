import React from 'react';

import { useSearchPageContainer } from '@/containers/SearchPageContainer/useSearchPageContainer';
import { SearchPage } from '@/pages/SearchPage';

export const SearchPageContainer: React.FC = () => {
  const searchPageProps = useSearchPageContainer();
  return <SearchPage {...searchPageProps} />;
};
