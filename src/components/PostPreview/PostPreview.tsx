import './PostPreview.scss';

import { Box, BoxProps, Heading, Skeleton, Text } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

import { ArticleMetadata } from '@/components';
import { ContentTypeEnum } from '@/constants';

export type PostPreviewOptions = {
  contentType?: ContentTypeEnum.ARTICLE | ContentTypeEnum.TUTORIAL;
  slug?: string;
  title?: React.ReactNode;
  excerpt?: React.ReactNode;
  date?: React.ReactNode;
  readingTime?: number;
  authors?: { username: string; name: string }[];
  link?: React.ComponentPropsWithoutRef<'a'>;
  tutorialLabel?: string;
  isLoading?: boolean;
};

export type PostPreviewProps = PostPreviewOptions & BoxProps;

export const PostPreview: React.FC<PostPreviewProps> = ({
  slug,
  contentType,
  title,
  excerpt,
  date,
  readingTime,
  authors,
  link = {},
  isLoading = false,
  tutorialLabel,
  ...props
}) => (
  <Box as="article" {...props} p="m" className={classNames('post-preview')}>
    <Skeleton isLoading={isLoading}>
      <Heading as="h2" size="s" className="post-preview__heading">
        <Heading as="a" {...link} size="m" data-internal-link="post" className="post-preview__link">
          {title}
        </Heading>
        {contentType === ContentTypeEnum.TUTORIAL && (
          <Text
            size="xs"
            py="xxs-3"
            px="xxs-2"
            color="navy"
            textTransform="uppercase"
            fontWeight="bold"
            className="post-preview__tutoriel-tag"
          >
            {tutorialLabel}
          </Text>
        )}
      </Heading>
    </Skeleton>
    <ArticleMetadata mt="xxs" date={date} readingTime={readingTime} authors={authors} isLoading={isLoading} />
    <Skeleton isLoading={isLoading}>
      <Text mt="xs" size="s" hiddenBelow="md" className="post-preview__excerpt">
        {excerpt}
      </Text>
    </Skeleton>
  </Box>
);
