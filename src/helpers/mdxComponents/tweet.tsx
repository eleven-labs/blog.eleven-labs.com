import React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { Icon } from '@/design-system/ui/icon';

export interface TweetProps {
  url: string;
  author: string;
  date: string;
  // A tweet that X no longer displays, deleted or protected: the Twitter script would replace it with a notice
  unavailable?: boolean;
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
 * An unavailable tweet stays the card, which the Twitter script ignores, on the height of its text.
 */
export const Tweet: React.FC<TweetProps> = ({ url, author, date, unavailable, children }) => {
  // `Name (@handle)`, as written by the Twitter embeds
  const [, name = author, handle] = author.match(/^(.*?)\s*\((@[^)]+)\)$/) ?? [];
  const hasPicture = getText(children).includes('pic.twitter.com');

  return (
    <div className="tweet-frame @container mx-auto">
      <div
        className="flex flex-col"
        style={unavailable ? undefined : { minHeight: hasPicture ? 'calc(225px + 55cqw)' : '240px' }}
      >
        <blockquote className={cn('tweet', !unavailable && 'twitter-tweet')}>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="mb-0">
              <span className="font-bold">{name}</span>
              {handle && <span className="text-muted"> {handle}</span>}
            </p>
            <Icon name="twitter" size="24px" aria-hidden />
          </div>
          {children}
          <p className="mb-0 body-xs">
            <a href={url}>{date}</a>
          </p>
        </blockquote>
      </div>
    </div>
  );
};
