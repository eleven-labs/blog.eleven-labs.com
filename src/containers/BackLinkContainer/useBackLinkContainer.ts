import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router-dom';

import { BackLinkProps } from '@/components';
import { PATHS } from '@/constants';

export const useBackLinkContainer = (): BackLinkProps => {
  const { t, i18n } = useTranslation();

  return {
    as: 'a',
    label: t('common.back'),
    href: generatePath(PATHS.HOME, { lang: i18n.language }),
    onClick: (e) => {
      const currentDomain = window.location.hostname;
      const referrerUrl = new URL(document.referrer);
      const referrerDomain = referrerUrl.hostname;

      if (referrerDomain === currentDomain) {
        e.preventDefault();
        window.location.href = document.referrer;
      }
    },
  } as ReturnType<typeof useBackLinkContainer>;
};
