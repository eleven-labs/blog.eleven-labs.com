import type { SearchPageContentProps } from './SearchPageContent';

import React from 'react';

import { LayoutContentWithSidebar } from '@/templates/LayoutContentWithSidebar';

import { SearchPageContent } from './SearchPageContent';

export interface SearchPageProps extends SearchPageContentProps {
  sidebar: React.ReactNode;
}

export const SearchPage: React.FC<SearchPageProps> = ({ sidebar, ...searchPageContent }) => (
  <>
    <LayoutContentWithSidebar content={<SearchPageContent {...searchPageContent} />} sidebar={sidebar} />
  </>
);
