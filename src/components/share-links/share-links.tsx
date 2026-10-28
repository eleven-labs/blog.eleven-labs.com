import React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { Icon } from '@/design-system/ui/icon';

export interface ShareLinksProps {
  urlToShare: string;
  shares: {
    twitter?: boolean;
    facebook?: boolean;
    linkedIn?: boolean;
  };
  /** Noms accessibles des liens (les icônes n'ont pas de texte) : à traduire à l'appel. */
  labels?: {
    twitter?: string;
    facebook?: string;
    linkedIn?: string;
  };
  className?: string;
}

const objectToGetParams = (object: { [key: string]: string | number | undefined | null }): string => {
  const params = Object.entries(object)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return params.length > 0 ? `?${params.join('&')}` : '';
};

/** Liens de partage d'une page sur les réseaux sociaux ; chaque lien porte un nom accessible (`labels`). */
export const ShareLinks: React.FC<ShareLinksProps> = ({ urlToShare, shares, labels = {}, className }) => (
  <div className={cn('flex items-center gap-3', className)}>
    {shares.twitter && (
      <a
        href={`https://twitter.com/intent/tweet${objectToGetParams({ url: urlToShare })}`}
        target="_blank"
        rel="noreferrer"
        aria-label={labels.twitter ?? 'Partager sur X (Twitter)'}
      >
        <Icon name="twitter" className="text-ink" size="36px" aria-hidden="true" />
      </a>
    )}
    {shares.facebook && (
      <a
        href={`https://www.facebook.com/sharer/sharer.php${objectToGetParams({ u: urlToShare })}`}
        target="_blank"
        rel="noreferrer"
        aria-label={labels.facebook ?? 'Partager sur Facebook'}
      >
        <Icon name="facebook" size="36px" aria-hidden="true" />
      </a>
    )}
    {shares.linkedIn && (
      <a
        href={`https://linkedin.com/shareArticle${objectToGetParams({ url: urlToShare, mini: 'true' })}`}
        target="_blank"
        rel="noreferrer"
        aria-label={labels.linkedIn ?? 'Partager sur LinkedIn'}
      >
        <Icon name="linkedin" size="36px" aria-hidden="true" />
      </a>
    )}
  </div>
);
