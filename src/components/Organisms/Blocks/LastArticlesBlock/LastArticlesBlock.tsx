import type { PostCardProps } from '@/components';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { PostCard } from '@/components';
import { Button, Heading } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface LastArticlesBlockProps {
  title: React.ReactNode;
  posts: Partial<PostCardProps>[];
  linkSeeMore: { label: string } & ComponentPropsWithoutRef<'a'>;
  className?: string;
}

export const LastArticlesBlock: React.FC<LastArticlesBlockProps> = ({
  title,
  posts,
  linkSeeMore: { label: labelLinkSeeMore, ...linkSeeMore },
  className,
}) => (
  <div className={cn('container-content my-xl', className)}>
    <Heading size="m" className="text-primary">
      {title}
    </Heading>
    {/* Deux colonnes sur un écran moyen, trois au-delà : la troisième carte n'apparaît qu'une fois
        qu'elle a la place de remplir sa propre colonne. */}
    <div className="mt-l grid gap-m md:grid-cols-2 lg:grid-cols-3 md:[&>*:last-child]:hidden lg:[&>*:last-child]:flex">
      {posts.map((post, index) => (
        <React.Fragment key={post?.slug ?? index}>
          <PostCard variant="highlight-light" {...(post || {})} />
        </React.Fragment>
      ))}
    </div>
    <div className="flex items-center justify-center">
      <Button className="mt-l" as="a" {...linkSeeMore}>
        {labelLinkSeeMore}
      </Button>
    </div>
  </div>
);
