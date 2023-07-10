import { useMeta, useScript } from 'hoofd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export type UseSeoOptions = {
  title: string;
};

export const useSeo = ({ title }: UseSeoOptions): void => {
  const { i18n } = useTranslation();
  const location = useLocation();

  const jsonLd: object[] = [];
  useMeta({ property: 'og:title', content: title });
  useMeta({ property: 'og:locale', content: i18n.language });
  useMeta({ property: 'og:site_name', content: 'Blog Eleven Labs' });
  useMeta({ property: 'og:url', content: location.pathname + location.search });

  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Blog Eleven Labs',
    url: 'https://blog.eleven-labs.com/',
  });
  useScript({
    type: 'application/ld+json',
    text: JSON.stringify(jsonLd),
  });
};
