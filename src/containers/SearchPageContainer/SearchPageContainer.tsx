import { Box, LayoutContentWithSidebar, NewsletterCard } from '@eleven-labs/design-system';
import React from 'react';

import { useNewsletterCard } from '@/hooks/useNewsletterCard';

import { SearchPageContentContainer } from './SearchPageContentContainer';

export const SearchPageContainer: React.FC = () => {
  const newsletterCard = useNewsletterCard();
  const sidebar = (
    <>
      <NewsletterCard {...newsletterCard} />
    </>
  );
  return (
    <LayoutContentWithSidebar
      content={
        <Box id="searchPageContent">
          <SearchPageContentContainer />
        </Box>
      }
      sidebar={sidebar}
    />
  );
};
