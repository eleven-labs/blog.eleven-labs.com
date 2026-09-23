import React from 'react';

import { NewsletterCard } from '@/components';
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
        <div id="searchPageContent">
          <SearchPageContentContainer />
        </div>
      }
      sidebar={sidebar}
    />
  );
};
