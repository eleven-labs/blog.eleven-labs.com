import './PostPreview.scss';

import { Heading, Link, Skeleton, Text } from '@eleven-labs/design-system';
import React from 'react';

import { PostPreviewOptions } from './PostPreview';

const PostPreviewContent = ({
  isLoading,
  hasMask,
  title,
  link,
  isRelated,
  excerpt,
}: Partial<PostPreviewOptions>): React.ReactNode => {
  return (
    <>
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
    </>
  );
};

export default PostPreviewContent;
