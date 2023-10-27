import './PostPreview.scss';

import { AsProps, Box, BoxProps, Flex, Heading, Link, Skeleton, Text } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

import { SeparatorCircle, TutoTag } from '@/components';
import { ContentTypeEnum } from '@/constants';

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
  isHighlighted = true,
  image,
  ...boxProps
}) => (
  <Box className={classNames({ 'post-preview--highlighted': isHighlighted })}>
    <div>{isHighlighted && <img src={image?.source} alt={image?.alt} />}</div>
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
};
