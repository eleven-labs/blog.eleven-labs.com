import React from 'react';
import { useTranslation } from 'react-i18next';

import { formatDuration, toIsoDuration } from '@/helpers/durationHelper';

export interface ReadingTime {
  label: string;
  dateTime: string;
}

export interface UseReadingTime {
  getReadingTime: (minutes?: number) => ReadingTime | undefined;
}

export const useReadingTime = (): UseReadingTime => {
  const { t } = useTranslation();
  const getReadingTime = React.useCallback<UseReadingTime['getReadingTime']>(
    (minutes) =>
      minutes
        ? {
            label: formatDuration(minutes, {
              hour: t('common.reading_time.hour'),
              minute: t('common.reading_time.minute'),
            }),
            dateTime: toIsoDuration(minutes),
          }
        : undefined,
    [t]
  );

  return {
    getReadingTime,
  };
};
