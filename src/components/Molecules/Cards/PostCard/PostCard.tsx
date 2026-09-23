import type { VariantProps } from 'class-variance-authority';

import type { PictureProps } from '@/design-system';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import { cva } from 'class-variance-authority';
import React from 'react';

import { PostMetadata } from '@/components';
import { Heading, Picture, Skeleton, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export const postCardVariant = ['highlight-light', 'highlight-dark', 'side-image'] as const;
export type PostCardVariantType = (typeof postCardVariant)[number];

export const postCardVariants = cva('relative flex flex-col gap-s rounded-s p-s [--post-card-cover-width:100%]', {
  variants: {
    variant: {
      'highlight-light': 'bg-white',
      'highlight-dark': 'bg-[rgb(0_0_0/15%)] text-white',
      // Seule déclinaison à poser la couverture à côté du texte, et seulement une fois la carte
      // assez large : en dessous, la vignette serait trop petite pour porter quoi que ce soit.
      'side-image': 'bg-white sm:flex-row sm:items-center sm:[--post-card-cover-width:clamp(160px,32%,288px)]',
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
  readingTime?: number;
  authors?: { username: string; name: string }[];
  link?: ComponentPropsWithoutRef<'a'>;
  tutorialLabel?: string;
  isLoading?: boolean;
  className?: string;
}

// Toutes les déclinaisons, à toutes les largeurs, rendent la couverture dans le même cadre 16/9 :
// une seule image source, cadrée une fois, suffit pour toutes.
const coverClassName = 'block h-auto w-full rounded-xs object-cover aspect-video';

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
    {/* Porte la largeur de la couverture : un pourcentage posé sur l'<img> ne saurait pas contre
        quoi se résoudre. */}
    <div className="w-(--post-card-cover-width) flex-none *:block *:w-full">
      <Skeleton isLoading={isLoading}>
        <Picture {...cover} img={{ ...cover?.img, className: coverClassName }} />
      </Skeleton>
    </div>
    <div className="flex-1">
      <div className="flex items-start justify-between gap-xs">
        <Skeleton isLoading={isLoading} className="min-w-0 flex-1">
          <Heading
            as="h2"
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
            <Text
              as="a"
              {...link}
              size="m"
              data-internal-link="post"
              // Le lien couvre toute la carte, qui devient ainsi cliquable d'un bout à l'autre.
              className={cn(
                "before:absolute before:inset-0 before:z-1 before:content-['_']",
                variant === 'highlight-dark' ? 'text-white' : 'text-black'
              )}
            >
              {title}
            </Text>
          </Heading>
        </Skeleton>
        {/* Posée sur la ligne du titre plutôt qu'épinglée au coin de la carte, où elle
            recouvrirait la couverture maintenant que la vignette remplit son cadre. */}
        {contentType === 'tutorial' && (
          <Text
            size="xs"
            className="flex-none rounded-xs bg-accent px-xxs-2 py-xxs-3 font-heading font-bold tracking-[0.5px] text-primary uppercase"
          >
            {tutorialLabel}
          </Text>
        )}
      </div>
      <PostMetadata
        variant="primary"
        className="mt-xxs"
        date={date}
        readingTime={readingTime}
        authors={authors}
        isLoading={isLoading}
      />
      {variant !== 'highlight-dark' && (
        <Skeleton isLoading={isLoading}>
          <Text
            size="s"
            className={cn('mt-xs max-md:hidden', variant === 'side-image' ? 'line-clamp-2' : 'line-clamp-4')}
          >
            {excerpt}
          </Text>
        </Skeleton>
      )}
    </div>
  </article>
);
