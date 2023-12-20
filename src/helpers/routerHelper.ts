import { generatePath as generatePathBase } from 'react-router-dom';

import { ROOT_URL } from '@/constants';

export const generatePath: typeof generatePathBase = (...args): string => {
  const path = generatePathBase(...args);
  return !path.endsWith('/') ? path.concat('/') : path;
};

export const generateUrl: typeof generatePathBase = (...args): string => {
  let path = generatePath(...args);
  return `${ROOT_URL}${path.startsWith('/') ? path.substring(1) : path}`;
};
