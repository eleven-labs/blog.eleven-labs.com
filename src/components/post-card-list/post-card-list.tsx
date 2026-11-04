import type { PostCardListPagination } from './post-card-list-pager';

import type { PostCardProps } from '@/components/post-card';

import React from 'react';

import { PostCard } from '@/components/post-card';

import { PostCardListPager } from './post-card-list-pager';

export interface PostCardListProps {
  posts: Partial<PostCardProps>[];
  pagination?: PostCardListPagination;
  isLoading?: boolean;
}

/** Liste de cartes d'article, avec sa pagination quand il y a plus d'une page. */
export const PostCardList: React.FC<PostCardListProps> = ({ posts, pagination, isLoading = false }) => (
  <div className="flex flex-col gap-6">
    {posts.map((post, index) => (
      <React.Fragment key={post?.slug ?? index}>
        <PostCard {...(post || {})} isLoading={isLoading} />
      </React.Fragment>
    ))}
    {pagination && pagination.totalPages > 1 && <PostCardListPager {...pagination} />}
  </div>
);
