import type { AuthorCardProps } from '@/components/author-card';

import React from 'react';

import { AuthorCard } from '@/components/author-card';
import { Heading } from '@/design-system/ui/heading';

export interface PostFooterProps {
  title: React.ReactNode;
  authors: AuthorCardProps[];
  className?: string;
}

export const PostFooter: React.FC<PostFooterProps> = ({ title, authors, className }) => (
  <div className={className}>
    <Heading size="m" className="mb-2 text-brand">
      {title}
    </Heading>
    <div className="mt-8 flex flex-col gap-4">
      {authors.map((author, authorIndex) => (
        <AuthorCard key={authorIndex} {...author} />
      ))}
    </div>
  </div>
);
