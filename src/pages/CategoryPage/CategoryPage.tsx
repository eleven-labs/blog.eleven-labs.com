import type { CategoryPageContentProps } from './CategoryPageContent';

import type { CategoryIntroBlockProps } from '@/components/category-intro-block';
import type { NewsletterCardProps } from '@/components/newsletter-card';

import React from 'react';

import { CategoryIntroBlock } from '@/components/category-intro-block';
import { NewsletterCard } from '@/components/newsletter-card';
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
