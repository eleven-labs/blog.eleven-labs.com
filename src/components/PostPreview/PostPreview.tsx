import './PostPreview.scss';

import { AsProps, Box, BoxProps, Heading, Link, Text } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

import { SeparatorCircle } from '@/components';

export type PostPreviewOptions = {
  title: React.ReactNode;
  excerpt: React.ReactNode;
  date: React.ReactNode;
  readingTime: React.ReactNode;
  authors: string[];
  link?: AsProps<'a'>;
  hasMask?: boolean;
  isRelated?: boolean;
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
  ...boxProps
}) => (
  <Box
    as="article"
    className={classNames('post-preview', { 'post-preview--mask': hasMask }, { 'post-preview--related': isRelated })}
    {...boxProps}
  >
    <Heading as="h2" color="amaranth" size="s" mb={{ xs: 'xxs-3', md: 'xxs' }}>
      {hasMask ? title : <Link {...link}>{title}</Link>}
    </Heading>
    <Text size="s" className="post-preview__excerpt">
      {excerpt}
    </Text>
    <Box mt={{ xs: 'xs', md: 's' }} textSize="xs">
      <Text as="span">{date}</Text>
      <SeparatorCircle />
      <Text as="span">{readingTime}</Text>
      <SeparatorCircle />
      {authors.map((author, authorIndex) => (
        <Text key={authorIndex} as="span">
          {author}
          {authorIndex !== authors.length - 1 ? ' & ' : ''}
        </Text>
      ))}
    </Box>
  </Box>
);
