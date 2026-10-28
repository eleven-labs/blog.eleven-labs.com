import type { AuthorPageContentProps } from './AuthorPageContent';

import type { NewsletterCardProps } from '@/components/newsletter-card';

import React from 'react';

import { NewsletterCard } from '@/components/newsletter-card';
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
