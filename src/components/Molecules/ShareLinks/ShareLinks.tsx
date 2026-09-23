import type { MarginSystemProps } from '@/design-system/types';

import React from 'react';

import { Flex, Icon } from '@/design-system';

import './ShareLinks.scss';

export interface ShareLinksProps extends MarginSystemProps {
  urlToShare: string;
  shares: {
    twitter?: boolean;
    facebook?: boolean;
    linkedIn?: boolean;
  };
}

const objectToGetParams = (object: { [key: string]: string | number | undefined | null }) => {
  const params = Object.entries(object)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return params.length > 0 ? `?${params.join('&')}` : '';
};

export const ShareLinks: React.FC<ShareLinksProps> = ({ urlToShare, shares, ...flexProps }) => (
  <Flex {...flexProps} alignItems="center" gap="xs" className="share-links">
    {shares.twitter && (
      <a
        href={`https://twitter.com/intent/tweet${objectToGetParams({ url: urlToShare })}`}
        target="_blank"
        rel="noreferrer"
      >
        <Icon
          name="twitter"
          className="share-links__social-media-icon share-links__social-media-icon--twitter"
          size="36px"
        />
      </a>
    )}
    {shares.facebook && (
      <a
        href={`https://www.facebook.com/sharer/sharer.php${objectToGetParams({ u: urlToShare })}`}
        target="_blank"
        rel="noreferrer"
      >
        <Icon name="facebook" className="share-links__social-media-icon" size="36px" />
      </a>
    )}
    {shares.linkedIn && (
      <a
        href={`https://linkedin.com/shareArticle${objectToGetParams({ url: urlToShare, mini: 'true' })}`}
        target="_blank"
        rel="noreferrer"
      >
        <Icon name="linkedin" className="share-links__social-media-icon" size="36px" />
      </a>
    )}
  </Flex>
);
