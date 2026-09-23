import type { PostCardProps } from '@/components';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { PostCard } from '@/components';
import { Button, Heading, Icon, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface LastTutorialsBlockProps {
  title: React.ReactNode;
  description: React.ReactNode;
  posts: Partial<PostCardProps>[];
  tutorialLabel: string;
  linkSeeMore: { label: string } & ComponentPropsWithoutRef<'a'>;
  className?: string;
}

export const LastTutorialsBlock: React.FC<LastTutorialsBlockProps> = ({
  title,
  description,
  tutorialLabel,
  posts,
  linkSeeMore: { label: labelLinkSeeMore, ...linkSeeMore },
  className,
}) => (
  <div className="bg-primary text-white">
    <div
      className={cn(
        'container-content flex flex-col items-center justify-center gap-xl py-xl md:flex-row',
        className
      )}
    >
      <div className="flex-1">
        <Heading size="m">{title}</Heading>
        <Icon name="underline" className="text-white" width="56px" />
        <Text className="mt-l">{description}</Text>
        <Button render={<a {...linkSeeMore} />} className="mt-l" variant="accent">
          {labelLinkSeeMore}
        </Button>
      </div>
      <div className="grid w-full gap-l md:flex-2 md:grid-cols-2">
        {posts.map((post, index) => (
          <React.Fragment key={post?.slug ?? index}>
            <PostCard variant="highlight-dark" tutorialLabel={tutorialLabel} {...(post || {})} />
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);
