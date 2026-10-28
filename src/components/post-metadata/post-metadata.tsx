import type { VariantProps } from 'class-variance-authority';

import type { ComponentPropsWithoutRef } from '@/design-system/types';

import { cva } from 'class-variance-authority';
import React, { Fragment } from 'react';

import { cn } from '@/design-system/helpers/cn';
import { Icon } from '@/design-system/ui/icon';
import { Link } from '@/design-system/ui/link';
import { Skeleton } from '@/design-system/ui/skeleton';
import { Text } from '@/design-system/ui/text';

export const postMetadataVariants = cva('post-metadata', {
  variants: {
    variant: {
      primary: 'post-metadata-primary',
      secondary: 'post-metadata-secondary',
    },
  },
});

export type PostMetadataVariantType = 'primary' | 'secondary';

export interface PostMetadataProps extends VariantProps<typeof postMetadataVariants> {
  date?: string;
  /** Le temps de lecture déjà formaté, et sa durée ISO 8601 pour l'attribut `datetime`. */
  readingTime?: {
    label: string;
    dateTime: string;
  };
  authors?: {
    username: string;
    name: string;
    link?: ComponentPropsWithoutRef<'a'>;
  }[];
  isLoading?: boolean;
  displayedFields?: ('date' | 'readingTime' | 'authors')[];
  className?: string;
}

/** Date, temps de lecture et auteurs d'un article ; `displayedFields` choisit les champs et leur ordre. */
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
          <Skeleton key={displayedField} isLoading={isLoading} className="post-metadata-field post-metadata-field-date">
            {/* La date ne se coupe pas : elle garde toujours la largeur de son contenu. */}
            <div className="flex min-w-max items-center gap-2">
              {variant === 'secondary' && <Icon name="calendar" size="24px" className="text-line-strong" />}
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
            className="post-metadata-field post-metadata-field-reading-time"
          >
            <div className="flex items-center gap-2">
              {variant === 'secondary' && <Icon name="access-time" size="24px" className="text-line-strong" />}
              {readingTime && (
                <Text render={<time dateTime={readingTime.dateTime} />} className="whitespace-nowrap">
                  {readingTime.label}
                </Text>
              )}
            </div>
          </Skeleton>
        );
        break;
      }
      case 'authors': {
        const authorChildren = authors && (
          <>
            {variant === 'secondary' && <Icon name="person" size="24px" className="text-line-strong" />}
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
            className="post-metadata-field post-metadata-field-authors"
          >
            {variant === 'secondary' ? (
              <div className="flex items-center gap-2">{authorChildren}</div>
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
        <Text key={`circle-${displayedField}`} render={<span aria-hidden="true" />}>
          •
        </Text>
      );
    }

    return currentFields;
  }, []);

  return <div className={cn(postMetadataVariants({ variant }), className)}>{fields}</div>;
};
