import { useMeta, useTitle as useTitleBase } from 'hoofd';

export const useTitle = (title: string): void => {
  useTitleBase(title);
  useMeta({ property: 'og:title', content: title });
};
