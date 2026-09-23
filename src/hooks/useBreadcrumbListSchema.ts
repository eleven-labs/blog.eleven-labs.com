import { useScript } from 'hoofd';

import { getUrl } from '@/helpers/getUrlHelper';

// The breadcrumb is only declared in JSON-LD, the Breadcrumb component of the design system has no microdata
// so that Google never reads two different trails on the same page
export const useBreadcrumbListSchema = (items: { name: string; path: string }[]): void => {
  useScript({
    type: 'application/ld+json',
    text: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: getUrl(item.path),
      })),
    }),
  });
};
