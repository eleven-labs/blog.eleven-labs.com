import './PostPreview.scss';

import { AsProps, Box, BoxProps, Flex, Heading, Link, Skeleton, Text } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

import { ArticleMetadata, TutoTag } from '@/components';
import { ContentTypeEnum } from '@/constants';

export type PostPreviewOptions = {
  contentType?: ContentTypeEnum.ARTICLE | ContentTypeEnum.TUTORIAL;
  title?: React.ReactNode;
  excerpt?: React.ReactNode;
  date?: React.ReactNode;
  readingTime?: number;
  authors?: { username: string; name: string }[];
  link?: AsProps<'a'>;
  hasMask?: boolean;
  isRelated?: boolean;
  isLoading?: boolean;
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
  ...boxProps
}) => {
  const titleBlock = hasMask ? (
    (title as React.JSX.Element)
  ) : (
    <Link {...link} data-internal-link={isRelated ? 'relatedPost' : 'post'}>
      {title}
    </Link>
  );
  return (
    <Box
      as="article"
      className={classNames('post-preview', { 'post-preview--mask': hasMask }, { 'post-preview--related': isRelated })}
      {...boxProps}
    >
      <Skeleton isLoading={isLoading}>
        <Heading as="h2" color="amaranth" size="s">
          {contentType === ContentTypeEnum.TUTORIAL ? (
            <Flex gap="xxs">
              <TutoTag />
              {titleBlock}
            </Flex>
          ) : (
            titleBlock
          )}
        </Heading>
      </Skeleton>
      <Skeleton isLoading={isLoading} style={{ height: 75 }}>
        <Text size="s" className="post-preview__excerpt">
          {excerpt}
        </Text>
      </Skeleton>
      <ArticleMetadata mt={{ xs: 'xs', md: 's' }} date={date} readingTime={readingTime} authors={authors} />
    </Box>
  );
};
