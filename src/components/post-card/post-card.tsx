import type { VariantProps } from 'class-variance-authority';

import type { PostMetadataProps } from '@/components/post-metadata';
import type { ComponentPropsWithoutRef } from '@/design-system/types';
import type { PictureProps } from '@/design-system/ui/picture';

import { cva } from 'class-variance-authority';
import React from 'react';

import { PostMetadata } from '@/components/post-metadata';
import { cn } from '@/design-system/helpers/cn';
import { Heading } from '@/design-system/ui/heading';
import { Picture } from '@/design-system/ui/picture';
import { Skeleton } from '@/design-system/ui/skeleton';
import { Text } from '@/design-system/ui/text';

export const postCardVariant = ['highlight-light', 'highlight-dark', 'side-image'] as const;
export type PostCardVariantType = (typeof postCardVariant)[number];

export const postCardVariants = cva('card post-card', {
  variants: {
    variant: {
      // Carte blanche de la classe de base, vignette au-dessus du texte
      'highlight-light': '',
      'highlight-dark': 'post-card-highlight-dark',
      'side-image': 'post-card-side-image',
    },
  },
  defaultVariants: {
    variant: 'side-image',
  },
});

export interface PostCardProps extends VariantProps<typeof postCardVariants> {
  slug?: string;
  contentType?: 'article' | 'tutorial';
  cover?: PictureProps;
  title?: string;
  excerpt?: string;
  date?: string;
  readingTime?: PostMetadataProps['readingTime'];
  authors?: { username: string; name: string }[];
  link?: ComponentPropsWithoutRef<'a'>;
  tutorialLabel?: string;
  isLoading?: boolean;
  className?: string;
}

/** Carte d'un article ou d'un tutoriel : couverture, titre-lien, métadonnées et extrait, cliquable sur toute sa surface. */
export const PostCard: React.FC<PostCardProps> = ({
  contentType,
  variant = 'side-image',
  cover = {},
  title,
  excerpt,
  date,
  readingTime,
  authors,
  link = {},
  isLoading = false,
  tutorialLabel,
  className,
}) => (
  <article className={cn(postCardVariants({ variant }), className)}>
    <div className="post-card-cover">
      <Skeleton isLoading={isLoading}>
        <Picture {...cover} img={{ ...cover?.img, className: 'post-card-image' }} />
      </Skeleton>
    </div>
    <div className="flex-1">
      <div className="flex items-start justify-between gap-3">
        <Skeleton isLoading={isLoading} className="min-w-0 flex-1">
          <Heading
            render={<h2 />}
            size="xs"
            className={cn(
              'min-w-0 flex-1',
              variant === 'highlight-dark'
                ? 'line-clamp-2'
                : variant === 'side-image'
                ? 'line-clamp-4 md:line-clamp-2'
                : 'line-clamp-4 md:line-clamp-3'
            )}
          >
            {/* Le lien couvre toute la carte, qui devient ainsi cliquable d'un bout à l'autre. */}
            <Text
              render={<a {...link} data-internal-link="post" />}
              size="m"
              className="post-card-title-link card-stretched-link"
            >
              {title}
            </Text>
          </Heading>
        </Skeleton>
        {contentType === 'tutorial' && (
          <Text size="xs" className="post-card-badge">
            {tutorialLabel}
          </Text>
        )}
      </div>
      <PostMetadata
        variant="primary"
        className="mt-2"
        date={date}
        readingTime={readingTime}
        authors={authors}
        isLoading={isLoading}
      />
      {variant !== 'highlight-dark' && (
        <Skeleton isLoading={isLoading}>
          <Text
            size="s"
            className={cn('mt-3 max-md:hidden', variant === 'side-image' ? 'line-clamp-2' : 'line-clamp-4')}
          >
            {excerpt}
          </Text>
        </Skeleton>
      )}
    </div>
  </article>
);
