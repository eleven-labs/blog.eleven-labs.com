import type { ComponentPropsWithoutRef, ReminderProps } from '@/design-system';

import React from 'react';

import { Icon, Kbd, Reminder as ReminderBase } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

/**
 * An image of a content: the `maxWidth`, `maxHeight`, `width` and `height` parameters of its url size it,
 * e.g. `schema.png?maxWidth=400`.
 */
export const ContentImage: React.FC<ComponentPropsWithoutRef<'img'>> = (props) => {
  const urlParams = new URLSearchParams(props.src?.split('?')?.[1] ?? '');
  return React.createElement('img', {
    // A tutorial gathers all of its steps on one page, its images are only loaded when read
    loading: 'lazy',
    decoding: 'async',
    ...props,
    style: {
      maxWidth: urlParams.get('maxWidth') ? `${urlParams.get('maxWidth')}px` : undefined,
      maxHeight: urlParams.get('maxHeight') ? `${urlParams.get('maxHeight')}px` : undefined,
      width: urlParams.get('width') ? `${urlParams.get('width')}px` : undefined,
      height: urlParams.get('height') ? `${urlParams.get('height')}px` : undefined,
    },
  });
};

export interface FigureProps extends ComponentPropsWithoutRef<'figure'> {
  src: string;
  alt: string;
  caption?: React.ReactNode;
}

// The caption is either the `caption` prop, or the children to write it in markdown
export const Figure: React.FC<FigureProps> = ({ src, alt, caption, children, ...props }) => (
  <figure {...props}>
    <ContentImage src={src} alt={alt} />
    {caption || children ? <figcaption>{caption ?? children}</figcaption> : null}
  </figure>
);

// Spaced out from the next block, the same way as the admonitions of the markdown
export const Reminder: React.FC<ReminderProps> = ({ className, ...props }) => (
  <ReminderBase className={cn('mb-xs', className)} {...props} />
);

export interface TweetProps {
  url: string;
  author: string;
  date: string;
  children?: React.ReactNode;
}

const getText = (node: React.ReactNode): string =>
  React.Children.toArray(node)
    .map((child) =>
      typeof child === 'string' || typeof child === 'number'
        ? String(child)
        : React.isValidElement<{ children?: React.ReactNode; href?: string }>(child)
        ? `${child.props.href ?? ''} ${getText(child.props.children)}`
        : ''
    )
    .join('');

/**
 * A tweet: the Twitter script, loaded by `entry-client`, replaces the card with the embed. The card reserves the
 * height of the embed, so that the page barely shifts once the embed displayed: 240px, or 225px plus the picture when
 * the tweet has one (a `pic.twitter.com` link), whose height follows the width of the tweet. These are the lowest
 * heights measured: a taller embed grows the block a little, rather than leaving an empty space under a shorter one.
 */
export const Tweet: React.FC<TweetProps> = ({ url, author, date, children }) => {
  // `Name (@handle)`, as written by the Twitter embeds
  const [, name = author, handle] = author.match(/^(.*?)\s*\((@[^)]+)\)$/) ?? [];
  const hasPicture = getText(children).includes('pic.twitter.com');

  return (
    <div className="@container mx-auto max-w-[550px]">
      <div className="flex flex-col" style={{ minHeight: hasPicture ? 'calc(225px + 55cqw)' : '240px' }}>
        <blockquote className="twitter-tweet">
          <div className="mb-xxs flex items-center justify-between gap-xs">
            <p className="mb-0">
              <span className="font-bold">{name}</span>
              {handle && <span className="text-grey"> {handle}</span>}
            </p>
            <Icon name="twitter" size="24px" aria-hidden />
          </div>
          {children}
          <p className="mb-0 text-xs">
            <a href={url}>{date}</a>
          </p>
        </blockquote>
      </div>
    </div>
  );
};

export interface YouTubeProps {
  id: string;
  title: string;
}

/**
 * A YouTube video, on the width of the post: its 16/9 ratio reserves its height before it loads, and the
 * `youtube-nocookie.com` domain sets no cookie until the video is played.
 */
export const YouTube: React.FC<YouTubeProps> = ({ id, title }) => (
  <div className="mb-xs aspect-video w-full">
    <iframe
      className="size-full"
      src={`https://www.youtube-nocookie.com/embed/${id}`}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  </div>
);

export interface VideoProps {
  src: string;
  title?: string;
  // The dimensions of the video, whose ratio reserves its height before it loads
  width?: number;
  height?: number;
  // The WebVTT captions of a video with speech
  captions?: string;
}

const VIDEO_TYPES: Record<string, string> = { mp4: 'video/mp4', ogv: 'video/ogg', webm: 'video/webm' };

// A video hosted by the blog, its type telling the browser whether it can play it before loading it
export const Video: React.FC<VideoProps> = ({ src, title, width, height, captions }) => (
  // The videos without speech, such as screen recordings, have no captions
  // eslint-disable-next-line jsx-a11y/media-has-caption
  <video
    className="mx-auto mb-xs w-full"
    title={title}
    style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
    controls
    preload="metadata"
  >
    <source src={src} type={VIDEO_TYPES[src.split('?')[0].split('.').pop()?.toLowerCase() ?? '']} />
    {captions && <track kind="captions" src={captions} default />}
  </video>
);

/**
 * The only components an MDX content can use: any other one fails the compilation of the content,
 * and therefore the validation of the contents. Whatever the markdown already renders (quotes, code, mermaid
 * diagrams) is written in markdown, the same way as in a `.md` content.
 */
export const mdxComponents = {
  Figure,
  Kbd,
  Reminder,
  Tweet,
  Video,
  YouTube,
};
