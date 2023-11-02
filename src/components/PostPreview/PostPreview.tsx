import { AsProps, BoxProps } from '@eleven-labs/design-system';
import React from 'react';

import { PostPreviewCard } from './PostPreviewCard';
import { PostPreviewContent } from './PostPreviewContent';
import { PostPreviewFooter } from './PostPreviewFooter';

export type PostPreviewOptions = {
  contentType?: ContentTypeEnum.ARTICLE | ContentTypeEnum.TUTORIAL;
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
  image,
  ...boxProps
}) => (
  <PostPreviewCard isHighlighted={isHighlighted} image={image} hasMask={hasMask} isRelated={isRelated} {...boxProps}>
    <PostPreviewContent
      isLoading={isLoading}
      isRelated={isRelated}
      title={title}
      link={link}
      excerpt={excerpt}
      hasMask={hasMask}
    />
    <PostPreviewFooter isLoading={isLoading} date={date} readingTime={readingTime} authors={authors} />
  </PostPreviewCard>
);
