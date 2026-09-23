import type { VariantProps } from 'class-variance-authority';

import type { ComponentPropsWithoutRef } from '@/design-system/types';

import { cva } from 'class-variance-authority';
import React, { Fragment } from 'react';

import { Icon, Link, Skeleton, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export const postMetadataVariants = cva('flex flex-wrap items-center text-s', {
  variants: {
    variant: {
      primary: 'gap-xxs font-heading font-bold tracking-[0.5px] text-info uppercase',
      secondary: 'gap-s font-semibold text-primary',
    },
  },
});

export type PostMetadataVariantType = 'primary' | 'secondary';

export interface PostMetadataProps extends VariantProps<typeof postMetadataVariants> {
  date?: string;
  readingTime?: number;
  authors?: {
    username: string;
    name: string;
    link?: ComponentPropsWithoutRef<'a'>;
  }[];
  isLoading?: boolean;
  displayedFields?: ('date' | 'readingTime' | 'authors')[];
  className?: string;
}

export const PostMetadata: React.FC<PostMetadataProps> = ({
  variant,
  date,
  readingTime,
  authors,
  isLoading = false,
  displayedFields = ['date', 'readingTime', 'authors'],
  className,
}) => {
  const fields = displayedFields.reduce<React.ReactNode[]>((currentFields, displayedField, index) => {
    switch (displayedField) {
      case 'date': {
        currentFields.push(
          <Skeleton
            key={displayedField}
            isLoading={isLoading}
            className="inline-block"
            style={{ minWidth: 60, minHeight: 16 }}
          >
            {/* La date ne se coupe pas : elle garde toujours la largeur de son contenu. */}
            <div className="flex min-w-max content-center items-center gap-xxs">
              {variant === 'secondary' && <Icon name="calendar" size="24px" className="text-light-grey" />}
              {date && <Text render={<span />}>{date}</Text>}
            </div>
          </Skeleton>
        );
        break;
      }
      case 'readingTime': {
        currentFields.push(
          <Skeleton
            key={displayedField}
            isLoading={isLoading}
            className="inline-block"
            style={{ minWidth: 26, minHeight: 16 }}
          >
            <div className="flex content-center items-center gap-xxs">
              {variant === 'secondary' && <Icon name="access-time" size="24px" className="text-light-grey" />}
              {readingTime && <Text render={<span />}>{`${readingTime}mn`}</Text>}
            </div>
          </Skeleton>
        );
        break;
      }
      case 'authors': {
        const authorChildren = authors && (
          <>
            {variant === 'secondary' && <Icon name="person" size="24px" className="text-light-grey" />}
            {authors.map(({ username, name, link }, authorIndex) => (
              <Fragment key={username}>
                {link ? <Link {...link}>{name}</Link> : <Text render={<span />}>{name}</Text>}
                {authorIndex !== authors.length - 1 && <Text render={<span />}>{' & '}</Text>}
              </Fragment>
            ))}
          </>
        );
        currentFields.push(
          <Skeleton
            key={displayedField}
            isLoading={isLoading}
            className="inline-block"
            style={{ minWidth: 50, minHeight: 16 }}
          >
            {variant === 'secondary' ? (
              <div className="flex content-center items-center gap-xxs">{authorChildren}</div>
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
        <Text key={`circle-${displayedField}`} render={<span />}>
          •
        </Text>
      );
    }

    return currentFields;
  }, []);

  return <div className={cn(postMetadataVariants({ variant }), className)}>{fields}</div>;
};
