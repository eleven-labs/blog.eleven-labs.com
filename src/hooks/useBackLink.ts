import { AsProps } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link, useLocation } from 'react-router-dom';

import { PATHS } from '@/constants';

export type UseBackLink = { label: React.ReactNode } & AsProps<'a'>;

export const useBackLink = (): UseBackLink => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  return {
    as: Link,
    label: t('common.back'),
    to: location?.state?.from || generatePath(PATHS.HOME, { lang: i18n.language }),
  } as ReturnType<typeof useBackLink>;
};
