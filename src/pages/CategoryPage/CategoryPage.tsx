import type { CategoryPageContentProps } from './CategoryPageContent';

import type { CategoryIntroBlockProps } from '@/components';
import type { NewsletterCardProps } from '@/components/Molecules/Cards/NewsletterCard';

import React from 'react';

import { CategoryIntroBlock } from '@/components';
import { NewsletterCard } from '@/components/Molecules/Cards/NewsletterCard';
import { LayoutContentWithSidebar } from '@/templates/LayoutContentWithSidebar';

import { CategoryPageContent } from './CategoryPageContent';

export interface CategoryPageProps extends CategoryPageContentProps {
  categoryIntroBlock: CategoryIntroBlockProps;
  newsletterCard: NewsletterCardProps;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryIntroBlock,
  newsletterCard,
  ...categoryPageContent
}) => (
  <>
    <CategoryIntroBlock {...categoryIntroBlock} />
    <LayoutContentWithSidebar
      content={<CategoryPageContent {...categoryPageContent} />}
      sidebar={<NewsletterCard {...newsletterCard} />}
    />
  </>
);
