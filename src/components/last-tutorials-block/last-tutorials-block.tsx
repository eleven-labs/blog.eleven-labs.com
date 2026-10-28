import type { PostCardProps } from '@/components/post-card';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { PostCard } from '@/components/post-card';
import { cn } from '@/design-system/helpers/cn';
import { Button } from '@/design-system/ui/button';
import { Heading } from '@/design-system/ui/heading';
import { Icon } from '@/design-system/ui/icon';
import { Text } from '@/design-system/ui/text';

export interface LastTutorialsBlockProps {
  title: React.ReactNode;
  description: React.ReactNode;
  posts: Partial<PostCardProps>[];
  tutorialLabel: string;
  linkSeeMore: { label: string } & ComponentPropsWithoutRef<'a'>;
  className?: string;
}

/** Derniers tutoriels : un bandeau bleu avec la présentation à gauche et les cartes à droite. */
export const LastTutorialsBlock: React.FC<LastTutorialsBlockProps> = ({
  title,
  description,
  tutorialLabel,
  posts,
  linkSeeMore: { label: labelLinkSeeMore, ...linkSeeMore },
  className,
}) => (
  <div className="bg-brand text-on-brand">
    <div
      className={cn('container-content flex flex-col items-center justify-center gap-10 py-10 md:flex-row', className)}
    >
      <div className="flex-1">
        <Heading size="m">{title}</Heading>
        <Icon name="underline" className="text-on-brand" width="56px" aria-hidden="true" />
        <Text className="mt-8">{description}</Text>
        <Button render={<a {...linkSeeMore} />} className="mt-8" variant="accent">
          {labelLinkSeeMore}
        </Button>
      </div>
      <div className="last-tutorials-cards">
        {posts.map((post, index) => (
          <React.Fragment key={post?.slug ?? index}>
            <PostCard variant="highlight-dark" tutorialLabel={tutorialLabel} {...(post || {})} />
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);
