import { Box, Skeleton, Text } from '@eleven-labs/design-system';
import React from 'react';

import { PostPreviewOptions, SeparatorCircle } from '@/components';

const PostPreviewFooter = ({ isLoading, date, readingTime, authors }: Partial<PostPreviewOptions>): React.ReactNode => {
  return (
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
  );
};

export default PostPreviewFooter;
