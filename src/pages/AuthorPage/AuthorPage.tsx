import type { AuthorPageContentProps } from './AuthorPageContent';

import type { NewsletterCardProps } from '@/components/Molecules/Cards/NewsletterCard';

import React from 'react';

import { NewsletterCard } from '@/components/Molecules/Cards/NewsletterCard';
import { AuthorPageContent } from '@/pages';
import { LayoutContentWithSidebar } from '@/templates/LayoutContentWithSidebar';

export interface AuthorPageProps extends AuthorPageContentProps {
  newsletterCard: NewsletterCardProps;
}

export const AuthorPage: React.FC<AuthorPageProps> = ({ newsletterCard, ...authorPageContent }) => (
  <LayoutContentWithSidebar
    content={<AuthorPageContent {...authorPageContent} />}
    sidebar={<NewsletterCard {...newsletterCard} />}
  />
);
