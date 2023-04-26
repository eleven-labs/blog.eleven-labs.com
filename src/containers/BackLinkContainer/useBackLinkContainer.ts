import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { BackLinkProps } from '@/components';
import { PATHS } from '@/constants';
import { LinkContainer } from '@/containers/LinkContainer';
import { generatePath } from '@/helpers/routerHelper';

export const useBackLinkContainer = (): BackLinkProps => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  return {
    as: LinkContainer,
    label: t('common.back'),
    to: location?.state?.from || generatePath(PATHS.HOME, { lang: i18n.language }),
  } as ReturnType<typeof useBackLinkContainer>;
};
