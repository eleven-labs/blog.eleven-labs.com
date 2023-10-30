import './PostPreview.scss';

import { Box, BoxProps, Heading, Link, PolymorphicPropsWithRef, Skeleton, Text } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

import { SeparatorCircle } from '@/components';

export type PostPreviewOptions = {
  title?: React.ReactNode;
  excerpt?: React.ReactNode;
  date?: React.ReactNode;
  readingTime?: React.ReactNode;
  authors?: { username: string; name: string }[];
  link?: PolymorphicPropsWithRef<'a', {}>;
  hasMask?: boolean;
  isRelated?: boolean;
  isLoading?: boolean;
};

export type PostPreviewProps = PostPreviewOptions & BoxProps;

export const PostPreview: React.FC<PostPreviewProps> = ({
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
}) => (
  <Box
    as="article"
    className={classNames('post-preview', { 'post-preview--mask': hasMask }, { 'post-preview--related': isRelated })}
    {...boxProps}
  >
    <Skeleton isLoading={isLoading}>
      <Heading as="h2" color="amaranth" size="s" mb={{ xs: 'xxs-3', md: 'xxs' }}>
        {hasMask ? (
          title
        ) : (
          <Link {...link} data-internal-link={isRelated ? 'relatedPost' : 'post'}>
            {title}
          </Link>
        )}
      </Heading>
    </Skeleton>
    <Skeleton isLoading={isLoading} style={{ height: 75 }}>
      <Text size="s" className="post-preview__excerpt">
        {excerpt}
      </Text>
    </Skeleton>
    <Box mt={{ xs: 'xs', md: 's' }} textSize="xs">
      <Skeleton isLoading={isLoading} display="inline-block" style={{ width: 100 }}>
        {date && <Text as="span">{date}</Text>}
      </Skeleton>
      <SeparatorCircle />
      <Skeleton isLoading={isLoading} display="inline-block" style={{ width: 50 }}>
        {readingTime && <Text as="span">{readingTime}</Text>}
      </Skeleton>
      <SeparatorCircle />
      <Skeleton isLoading={isLoading} display="inline-block" style={{ width: 100 }}>
        {authors &&
          authors.map((author, authorIndex) => (
            <Text key={author.username} as="span">
              {author.name}
              {authorIndex !== authors.length - 1 ? ' & ' : ''}
            </Text>
          ))}
      </Skeleton>
    </Box>
  </Box>
);
