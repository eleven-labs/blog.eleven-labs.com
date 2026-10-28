import { useTranslation } from 'react-i18next';

import { PATHS } from '@/constants';
import { generatePath, getHomePath } from '@/helpers/routerHelper';

export interface BreadcrumbData {
  /** Étapes du fil d'Ariane ; sans `href`, l'étape est la page courante. */
  items: { label: string; href?: string }[];
}

export const useBreadcrumb = (options: { categoryName?: string; withCategoryLink?: boolean }): BreadcrumbData => {
  const { t, i18n } = useTranslation();
  return {
    items: [
      {
        label: t('common.breadcrumb.home_label'),
        href: getHomePath(i18n.language),
      },
      {
        label: t(`common.categories.${options.categoryName ?? 'all'}`),
        href: options.withCategoryLink
          ? generatePath(PATHS.CATEGORY, {
              lang: i18n.language,
              categoryName: options.categoryName ?? 'all',
            })
          : undefined,
      },
    ],
  };
};
