import { SearchPage } from '@eleven-labs/design-system';
import React from 'react';

import { useSearchPageContainer } from '@/containers/SearchPageContainer/useSearchPageContainer';

export const SearchPageContainer: React.FC = () => {
  const searchPageProps = useSearchPageContainer();
  return <SearchPage {...searchPageProps} />;
};
