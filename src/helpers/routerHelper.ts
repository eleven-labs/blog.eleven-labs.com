import { generatePath as generatePathBase } from 'react-router-dom';

export const generatePath: typeof generatePathBase = (...args): string => {
  const path = generatePathBase(...args);
  return !path.endsWith('/') ? path.concat('/') : path;
};
