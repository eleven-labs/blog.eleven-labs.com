import type { PostCardProps } from '@/components/post-card';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { PostCard } from '@/components/post-card';
import { cn } from '@/design-system/helpers/cn';
import { Button } from '@/design-system/ui/button';
import { Heading } from '@/design-system/ui/heading';

export interface LastArticlesBlockProps {
  title: React.ReactNode;
  posts: Partial<PostCardProps>[];
  linkSeeMore: { label: string } & ComponentPropsWithoutRef<'a'>;
  className?: string;
}

/** Derniers articles : un titre, une grille de cartes et un lien vers tous les articles. */
export const LastArticlesBlock: React.FC<LastArticlesBlockProps> = ({
  title,
  posts,
  linkSeeMore: { label: labelLinkSeeMore, ...linkSeeMore },
  className,
}) => (
  <div className={cn('container-content my-10', className)}>
    <Heading size="m" className="text-brand">
      {title}
    </Heading>
    <div className="last-articles-grid">
      {posts.map((post, index) => (
        <React.Fragment key={post?.slug ?? index}>
          <PostCard variant="highlight-light" {...(post || {})} />
        </React.Fragment>
      ))}
    </div>
    <div className="flex items-center justify-center">
      <Button render={<a {...linkSeeMore} />} className="mt-8">
        {labelLinkSeeMore}
      </Button>
    </div>
  </div>
);
