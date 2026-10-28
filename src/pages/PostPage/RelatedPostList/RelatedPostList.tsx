import type { PostCardProps } from '@/components';

import React from 'react';

import { PostCard } from '@/components';
import { Heading } from '@/design-system/ui/heading';

export interface RelatedPostListProps {
  relatedPostListTitle: string;
  posts: PostCardProps[];
  className?: string;
}

export const RelatedPostList: React.FC<RelatedPostListProps> = ({ relatedPostListTitle, posts, className }) => (
  <div className={className}>
    <Heading size="m" className="mb-6 text-brand">
      {relatedPostListTitle}
    </Heading>
    {posts.map((post, index) => (
      <PostCard key={post?.slug ?? index} {...post} className="mt-4" />
    ))}
  </div>
);
