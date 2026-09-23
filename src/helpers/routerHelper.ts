import { generatePath as generatePathBase } from 'react-router-dom';

import { BASE_URL, DEFAULT_LANGUAGE, PATHS } from '@/constants';

export const generatePath: typeof generatePathBase = (originalPath, params): string => {
  const path = generatePathBase(originalPath, params);
  return `${BASE_URL}${(!path.endsWith('/') ? path.concat('/') : path).slice(1)}`;
};

// The home of the default language is served at the root, which is the url Google retained for the home
export const getHomePath = (lang: string): string =>
  lang === DEFAULT_LANGUAGE ? generatePath(PATHS.ROOT) : generatePath(PATHS.HOME, { lang });
