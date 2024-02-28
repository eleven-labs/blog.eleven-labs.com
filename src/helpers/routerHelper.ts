import { generatePath as generatePathBase } from 'react-router-dom';

import { BASE_URL } from '@/constants';

export const generatePath: typeof generatePathBase = (originalPath, params): string => {
  const path = generatePathBase(originalPath, params);
  return `${BASE_URL}${(!path.endsWith('/') ? path.concat('/') : path).slice(1)}`;
};
