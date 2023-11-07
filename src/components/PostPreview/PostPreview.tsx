import { AsProps, BoxProps } from '@eleven-labs/design-system';
import React from 'react';

import { ArticleMetadata } from '@/components';
import { ContentTypeEnum } from '@/constants';

import { PostPreviewCard } from './PostPreviewCard';
import { PostPreviewContent } from './PostPreviewContent';

export type PostPreviewOptions = {
  contentType?: ContentTypeEnum.ARTICLE | ContentTypeEnum.TUTORIAL;
  slug: string;
  title?: React.ReactNode;
  excerpt?: React.ReactNode;
  date?: React.ReactNode;
  readingTime?: number;
  authors?: { username: string; name: string }[];
  link?: AsProps<'a'>;
  image?: { source: string; alt: string };
  hasMask?: boolean;
  isRelated?: boolean;
  isLoading?: boolean;
  isHighlighted?: boolean;
};

export type PostPreviewProps = PostPreviewOptions & BoxProps;

export const PostPreview: React.FC<PostPreviewProps> = ({
  contentType,
  slug,
  title,
  excerpt,
  date,
  readingTime,
  authors,
  link = {},
  hasMask,
  isRelated,
  isLoading = false,
  isHighlighted = false,
  ...boxProps
}) => (
  <PostPreviewCard isHighlighted={isHighlighted} hasMask={hasMask} isRelated={isRelated} {...boxProps}>
    <PostPreviewContent
      contentType={contentType}
      isLoading={isLoading}
      isRelated={isRelated}
      title={title}
      link={link}
      excerpt={excerpt}
      hasMask={hasMask}
    />
    <ArticleMetadata mt={{ xs: 'xs', md: 's' }} slug={slug} date={date} readingTime={readingTime} authors={authors} />
  </PostPreviewCard>
);
