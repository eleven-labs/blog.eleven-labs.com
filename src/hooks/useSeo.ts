import { useHead, useScript } from 'hoofd';
import { useTranslation } from 'react-i18next';

export type UseSeoOptions = {
  title: string;
};

export const useSeo = (options: UseSeoOptions): void => {
  const { i18n } = useTranslation();
  useHead({
    title: options.title,
    metas: [
      { property: 'og:title', content: options.title },
      { property: 'og:locale', content: i18n.language },
    ],
  });
  useScript({
    type: 'application/ld+json',
    text: JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Blog Eleven Labs',
        url: 'https://blog.eleven-labs.com',
        image: 'https://blog.eleven-labs.com/imgs/logo.png',
      },
    ]),
  });
};
