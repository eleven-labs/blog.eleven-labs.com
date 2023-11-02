import './PostPreview.scss';

import { Flex } from '@eleven-labs/design-system';
import { Heading, Link, Skeleton, Text } from '@eleven-labs/design-system';
import React from 'react';

import { PostPreviewProps, TutoTag } from '@/components';
import { ContentTypeEnum } from '@/constants';

interface PostPreviewContentProps
  extends Pick<
    PostPreviewProps,
    'isLoading' | 'contentType' | 'hasMask' | 'title' | 'link' | 'isRelated' | 'excerpt'
  > {}

export const PostPreviewContent: React.FC<PostPreviewContentProps> = ({
  isLoading,
  contentType,
  hasMask,
  title,
  link,
  isRelated,
  excerpt,
}) => {
  const titleBlock = hasMask ? (
    (title as React.JSX.Element)
  ) : (
    <Link {...link} data-internal-link={isRelated ? 'relatedPost' : 'post'}>
      {title}
    </Link>
  );
  return (
    <>
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
    </>
  );
};
