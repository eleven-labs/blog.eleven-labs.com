import { format } from 'date-fns';
import localeDateEn from 'date-fns/locale/en-US';
import localeDateFr from 'date-fns/locale/fr';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface UseDateToString {
  getDateToString: (options: { date: string }) => string;
}

export const useDateToString = (): UseDateToString => {
  const { i18n } = useTranslation();
  const getDateToString = React.useCallback<UseDateToString['getDateToString']>(
    (options) =>
      format(new Date(options.date), 'PP', {
        locale: i18n.language === 'fr' ? localeDateFr : localeDateEn,
      }),
    [i18n.language]
  );

  return {
    getDateToString,
  };
};
