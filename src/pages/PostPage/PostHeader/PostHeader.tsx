import type { PostMetadataProps } from '@/components/post-metadata';
import type { ShareLinksProps } from '@/components/share-links';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { PostMetadata } from '@/components/post-metadata';
import { ShareLinks } from '@/components/share-links';
import { cn } from '@/design-system/helpers/cn';
import { Heading } from '@/design-system/ui/heading';

export interface PostHeaderProps {
  title: React.ReactNode;
  date: string;
  readingTime: PostMetadataProps['readingTime'];
  authors: {
    username: string;
    name: string;
    link: ComponentPropsWithoutRef<'a'>;
  }[];
  shareLinks: ShareLinksProps;
  className?: string;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ title, date, readingTime, authors, shareLinks, className }) => (
  <div className={cn('body-xs', className)}>
    <Heading render={<h1 />} size="xl" className="text-brand">
      {title}
    </Heading>
    <div className="mt-6 flex flex-col justify-between gap-3 md:flex-row">
      <PostMetadata variant="secondary" date={date} readingTime={readingTime} authors={authors} />
      <ShareLinks {...shareLinks} />
    </div>
  </div>
);
