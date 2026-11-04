import type { HomeIntroBlockProps } from '@/components/home-intro-block';
import type { LastArticlesBlockProps } from '@/components/last-articles-block';
import type { LastTutorialsBlockProps } from '@/components/last-tutorials-block';
import type { NewsletterCardProps } from '@/components/newsletter-card';

import React from 'react';

import { HomeIntroBlock } from '@/components/home-intro-block';
import { LastArticlesBlock } from '@/components/last-articles-block';
import { LastTutorialsBlock } from '@/components/last-tutorials-block';
import { NewsletterCard } from '@/components/newsletter-card';

export type HomePageProps = {
  homeIntroBlock: HomeIntroBlockProps;
  lastArticlesBlock: LastArticlesBlockProps;
  lastTutorialsBlock?: LastTutorialsBlockProps;
  newsletterCard: NewsletterCardProps;
};

export const HomePage: React.FC<HomePageProps> = ({
  homeIntroBlock,
  lastArticlesBlock,
  lastTutorialsBlock,
  newsletterCard,
}) => (
  <>
    <HomeIntroBlock {...homeIntroBlock} />
    <LastArticlesBlock {...lastArticlesBlock} />
    {lastTutorialsBlock && <LastTutorialsBlock {...lastTutorialsBlock} />}
    <NewsletterCard variant="horizontal" className="container-content my-10" {...newsletterCard} />
  </>
);
