import { BreadcrumbProps } from '@eleven-labs/design-system';
import { useTranslation } from 'react-i18next';

import { PATHS } from '@/constants';
import { generatePath } from '@/helpers/routerHelper';

export const useBreadcrumb = (options: { categoryName?: string; withCategoryLink?: boolean }): BreadcrumbProps => {
  const { t, i18n } = useTranslation();
  return {
    items: [
      {
        label: t('common.breadcrumb.home_label'),
        href: generatePath(PATHS.HOME, { lang: i18n.language }),
      },
      {
        label: t(`common.categories.${options.categoryName ?? 'all'}`),
        href: options.withCategoryLink
          ? generatePath(PATHS.CATEGORY, { lang: i18n.language, categoryName: options.categoryName ?? 'all' })
          : undefined,
      },
    ],
  };
};
