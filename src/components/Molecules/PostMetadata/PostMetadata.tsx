import type { ComponentPropsWithoutRef, SpacingSystemProps } from '@/design-system/types';

import classNames from 'classnames';
import React, { Fragment } from 'react';

import { Flex, Icon, Link, Skeleton, Text } from '@/design-system';

import './PostMetadata.scss';

export const postMetadataVariant = ['primary', 'secondary'] as const;
export type PostMetadataVariantType = (typeof postMetadataVariant)[number];

export interface PostMetadataProps extends SpacingSystemProps {
  variant?: PostMetadataVariantType;
  date?: string;
  readingTime?: number;
  authors?: {
    username: string;
    name: string;
    link?: ComponentPropsWithoutRef<'a'>;
  }[];
  isLoading?: boolean;
  displayedFields?: ('date' | 'readingTime' | 'authors')[];
}

export const PostMetadata: React.FC<PostMetadataProps> = ({
  variant,
  date,
  readingTime,
  authors,
  isLoading = false,
  displayedFields = ['date', 'readingTime', 'authors'],
  ...props
}) => {
  const fields = displayedFields.reduce<React.ReactNode[]>((currentFields, displayedField, index) => {
    switch (displayedField) {
      case 'date': {
        currentFields.push(
          <Skeleton
            key={displayedField}
            isLoading={isLoading}
            display="inline-block"
            style={{ minWidth: 60, minHeight: 16 }}
          >
            <Flex alignContent="center" alignItems="center" gap="xxs" className="post-metadata__date">
              {variant === 'secondary' && <Icon name="calendar" size="24px" color="light-grey" />}
              {date && <Text as="span">{date}</Text>}
            </Flex>
          </Skeleton>
        );
        break;
      }
      case 'readingTime': {
        currentFields.push(
          <Skeleton
            key={displayedField}
            isLoading={isLoading}
            display="inline-block"
            style={{ minWidth: 26, minHeight: 16 }}
          >
            <Flex alignContent="center" alignItems="center" gap="xxs">
              {variant === 'secondary' && <Icon name="access-time" size="24px" color="light-grey" />}
              {readingTime && <Text as="span">{`${readingTime}mn`}</Text>}
            </Flex>
          </Skeleton>
        );
        break;
      }
      case 'authors': {
        const authorChildren = authors && (
          <>
            {variant === 'secondary' && <Icon name="person" size="24px" color="light-grey" />}
            {authors.map(({ username, name, link }, authorIndex) => (
              <Fragment key={username}>
                {link ? <Link {...link}>{name}</Link> : <Text as="span">{name}</Text>}
                {authorIndex !== authors.length - 1 && <Text as="span">{' & '}</Text>}
              </Fragment>
            ))}
          </>
        );
        currentFields.push(
          <Skeleton
            key={displayedField}
            isLoading={isLoading}
            display="inline-block"
            style={{ minWidth: 50, minHeight: 16 }}
          >
            {variant === 'secondary' ? (
              <Flex alignContent="center" alignItems="center" gap="xxs" className="post-metadata__authors">
                {authorChildren}
              </Flex>
            ) : (
              <>{authorChildren}</>
            )}
          </Skeleton>
        );
        break;
      }
    }

    if (variant !== 'secondary' && index !== displayedFields.length - 1) {
      currentFields.push(
        <Text key={`circle-${displayedField}`} as="span">
          •
        </Text>
      );
    }

    return currentFields;
  }, []);

  return (
    <Flex
      {...props}
      alignItems="center"
      textSize="s"
      flexWrap="wrap"
      gap={variant === 'secondary' ? 's' : 'xxs'}
      className={classNames('post-metadata', { [`post-metadata--${variant}`]: variant })}
    >
      {fields}
    </Flex>
  );
};
