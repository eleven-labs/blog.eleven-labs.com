import { AsProps } from '@eleven-labs/design-system';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link, useNavigate } from 'react-router-dom';

import { PATHS } from '@/constants';

export const useBackLink = (): { label: React.ReactNode } & AsProps<'a'> => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const history: { state?: { idx?: number } } = typeof window !== 'undefined' ? window.history : {};

  const onBack = useCallback(() => {
    const blankNavigation = history?.state?.idx === 0;
    if (blankNavigation) {
      return navigate(generatePath(PATHS.HOME, { lang: i18n.language }));
    }

    navigate(-1);
  }, [history?.state]);

  return {
    as: Link,
    label: t('common.back'),
    to: generatePath(PATHS.HOME, { lang: i18n.language }),
    onClick: onBack,
  } as ReturnType<typeof useBackLink>;
};
