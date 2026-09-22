import React from 'react';

import { NewsletterCard } from '@/components';
import { Box } from '@/design-system';
import { useNewsletterCard } from '@/hooks/useNewsletterCard';
import { LayoutContentWithSidebar } from '@/templates';

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
