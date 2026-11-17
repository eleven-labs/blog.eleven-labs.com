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
      // Pour une liste dense, comme les suggestions de la recherche : la date et les auteurs,
      // plus petits que le titre qu'ils accompagnent, se lisent d'un coup d'œil grâce à leur icône.
      compact: 'gap-x-s gap-y-xxs-3 text-xs text-primary',
    },
  },
});

export type PostMetadataVariantType = 'primary' | 'secondary' | 'compact';

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

const ICON_SIZES: Partial<Record<PostMetadataVariantType, string>> = {
  secondary: '24px',
  compact: '16px',
};

export const PostMetadata: React.FC<PostMetadataProps> = ({
  variant,
  date,
  readingTime,
  authors,
  isLoading = false,
  displayedFields = ['date', 'readingTime', 'authors'],
  className,
}) => {
  const iconSize = variant ? ICON_SIZES[variant] : undefined;
  const hasIcons = Boolean(iconSize);

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
              {hasIcons && <Icon name="calendar" size={iconSize} className="flex-none text-light-grey" />}
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
              {hasIcons && <Icon name="access-time" size={iconSize} className="flex-none text-light-grey" />}
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
        // Les auteurs forment un seul texte : la liste ne se coupe pas entre un nom et son « & »,
        // et les espaces qui entourent ce dernier sont conservés.
        const authorNames = authors && (
          <span className={cn(variant === 'compact' && 'min-w-0 truncate')}>
            {authors.map(({ username, name, link }, authorIndex) => (
              <Fragment key={username}>
                {authorIndex > 0 && ' & '}
                {link ? <Link {...link}>{name}</Link> : name}
              </Fragment>
            ))}
          </span>
        );
        currentFields.push(
          <Skeleton
            key={displayedField}
            isLoading={isLoading}
            className="inline-block"
            style={{ minWidth: 50, minHeight: 16 }}
          >
            {hasIcons ? (
              <div className="flex min-w-0 content-center items-center gap-xxs">
                <Icon name="person" size={iconSize} className="flex-none text-light-grey" />
                {authorNames}
              </div>
            ) : (
              authorNames
            )}
          </Skeleton>
        );
        break;
      }
    }

    if (!hasIcons && index !== displayedFields.length - 1) {
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
