import type { ShareLinksProps } from '@/components/Molecules/ShareLinks';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { PostMetadata } from '@/components';
import { ShareLinks } from '@/components/Molecules/ShareLinks';
import { Heading } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface PostHeaderProps {
  title: React.ReactNode;
  date: string;
  readingTime: number;
  authors: {
    username: string;
    name: string;
    link: ComponentPropsWithoutRef<'a'>;
  }[];
  shareLinks: ShareLinksProps;
  className?: string;
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  title,
  date,
  readingTime,
  authors,
  shareLinks,
  className,
}) => (
  <div className={cn('text-xs', className)}>
    <Heading as="h1" size="xl" className="text-primary">
      {title}
    </Heading>
    <div className="mt-m flex flex-col justify-between gap-xs md:flex-row">
      <PostMetadata variant="secondary" date={date} readingTime={readingTime} authors={authors} />
      <ShareLinks {...shareLinks} />
    </div>
  </div>
);
