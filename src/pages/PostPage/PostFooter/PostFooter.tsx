import type { AuthorCardProps } from '@/components';

import React from 'react';

import { AuthorCard } from '@/components';
import { Heading } from '@/design-system';

export interface PostFooterProps {
  title: React.ReactNode;
  authors: AuthorCardProps[];
  className?: string;
}

export const PostFooter: React.FC<PostFooterProps> = ({ title, authors, className }) => (
  <div className={className}>
    <Heading size="m" className="mb-xxs text-primary">
      {title}
    </Heading>
    <div className="mt-l flex flex-col gap-s">
      {authors.map((author, authorIndex) => (
        <AuthorCard key={authorIndex} {...author} />
      ))}
    </div>
  </div>
);
