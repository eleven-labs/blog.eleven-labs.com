import { AsProps } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link } from 'react-router-dom';

import { PATHS } from '@/constants';

export const useBackLink = (): { label: React.ReactNode } & AsProps<'a'> => {
  const { t, i18n } = useTranslation();

  return {
    as: Link,
    label: t('common.back'),
    to: generatePath(PATHS.HOME, { lang: i18n.language }),
  } as ReturnType<typeof useBackLink>;
};
