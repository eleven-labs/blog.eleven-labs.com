import { ColorSystemProps, Flex, Skeleton, SpacingSystemProps, Text } from '@eleven-labs/design-system';
import React from 'react';

import { SeparatorCircle } from '@/components';

export type ArticleMetadataOptions = {
  slug: string;
  date?: React.ReactNode;
  readingTime?: number;
  authors?: { username: string; name: string }[];
  isLoading?: boolean;
  displayedFields?: ('contentType' | 'date' | 'readingTime' | 'authors')[];
};

export type ArticleMetadataProps = ArticleMetadataOptions & SpacingSystemProps & ColorSystemProps;

export const ArticleMetadata: React.FC<ArticleMetadataProps> = ({
  slug,
  date,
  readingTime,
  authors,
  isLoading = false,
  displayedFields = ['date', 'readingTime', 'authors'],
  ...props
}) => {
  const fields = displayedFields.reduce<React.ReactNode[]>((currentFields, displayedField, index) => {
    switch (displayedField) {
      case 'date':
        currentFields.push(
          <Skeleton key={`${slug}_${displayedField}`} isLoading={isLoading} display="inline-block" style={{ width: 100 }}>
            {date && <Text as="span">{date}</Text>}
          </Skeleton>
        );
        break;
      case 'readingTime':
        currentFields.push(
          <Skeleton key={`${slug}_${displayedField}`} isLoading={isLoading} display="inline-block" style={{ width: 50 }}>
            {readingTime && <Text as="span">{`${readingTime}mn`}</Text>}
          </Skeleton>
        );
        break;
      case 'authors':
        currentFields.push(
          <Skeleton key={`${slug}_${displayedField}`} isLoading={isLoading} display="inline-block" style={{ width: 100 }}>
            {authors &&
              authors.map((author, authorIndex) => (
                <React.Fragment key={`${slug}_${authorIndex}`}>
                  <Text as="span">
                    {author.name}
                  </Text>
                  {authorIndex !== authors.length - 1 && (
                    <Text as="span">
                      &nbsp;&amp;&nbsp;
                    </Text>
                  )}
                </React.Fragment>
              ))}
          </Skeleton>
        );
        break;
    }

    if (index !== displayedFields.length - 1) {
      currentFields.push(<SeparatorCircle key={`${slug}_circle_${displayedField}`} />);
    }

    return currentFields;
  }, []);

  return (
    <Flex {...props} textSize="xs" alignItems="center">
      {fields}
    </Flex>
  );
};
