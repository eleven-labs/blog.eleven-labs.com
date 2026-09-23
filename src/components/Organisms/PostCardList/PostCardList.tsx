import type { PostCardProps } from '@/components';
import type { PaginationProps } from '@/design-system';

import React from 'react';

import { PostCard } from '@/components';
import { Pagination } from '@/design-system';

export interface PostCardListProps {
  posts: Partial<PostCardProps>[];
  pagination?: PaginationProps;
  isLoading?: boolean;
}

export const PostCardList: React.FC<PostCardListProps> = ({ posts, pagination, isLoading = false }) => (
  <div className="flex flex-col gap-m">
    {posts.map((post, index) => (
      <React.Fragment key={post?.slug ?? index}>
        <PostCard {...(post || {})} isLoading={isLoading} />
      </React.Fragment>
    ))}
    {pagination && pagination?.totalPages > 1 && <Pagination className="mx-auto" {...pagination} />}
  </div>
);
