import React from 'react';

import { Icon } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface ShareLinksProps {
  urlToShare: string;
  shares: {
    twitter?: boolean;
    facebook?: boolean;
    linkedIn?: boolean;
  };
  className?: string;
}

const objectToGetParams = (object: { [key: string]: string | number | undefined | null }): string => {
  const params = Object.entries(object)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return params.length > 0 ? `?${params.join('&')}` : '';
};

export const ShareLinks: React.FC<ShareLinksProps> = ({ urlToShare, shares, className }) => (
  <div className={cn('flex items-center gap-xs', className)}>
    {shares.twitter && (
      <a
        href={`https://twitter.com/intent/tweet${objectToGetParams({ url: urlToShare })}`}
        target="_blank"
        rel="noreferrer"
      >
        <Icon name="twitter" className="text-black" size="36px" />
      </a>
    )}
    {shares.facebook && (
      <a
        href={`https://www.facebook.com/sharer/sharer.php${objectToGetParams({ u: urlToShare })}`}
        target="_blank"
        rel="noreferrer"
      >
        <Icon name="facebook" size="36px" />
      </a>
    )}
    {shares.linkedIn && (
      <a
        href={`https://linkedin.com/shareArticle${objectToGetParams({ url: urlToShare, mini: 'true' })}`}
        target="_blank"
        rel="noreferrer"
      >
        <Icon name="linkedin" size="36px" />
      </a>
    )}
  </div>
);
