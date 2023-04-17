import { getEnv } from '@/helpers/getEnvHelper';

export const IS_SSR = import.meta.env.SSR;
export const IS_PRERENDER = import.meta.env.MODE === 'prerender';
export const BASE_URL = getEnv<string>('BASE_URL') || '/';
export const AUTHORIZED_LANGUAGES = ['fr', 'en'] as const;
export const DEFAULT_LANGUAGE = 'fr';
export const NUMBER_OF_ITEMS_PER_PAGE = 6;

export const PATHS = {
  ROOT: '/',
  HOME: '/:lang/',
  PAGINATED_HOME: '/:lang/page/:page/',
  POST: '/:lang/:slug/',
  AUTHOR: '/:lang/authors/:authorUsername/',
  CATEGORY: '/:lang/categories/:categoryName/',
  SEARCH: '/:lang/search/',
};

export const CATEGORIES = ['javascript', 'php', 'agile', 'architecture'] as const;

export const ALGOLIA_CONFIG = {
  APP_ID: getEnv<string>('VITE_ALGOLIA_APP_ID'),
  API_KEY: getEnv<string>('VITE_ALGOLIA_API_KEY'),
  INDEX: getEnv<string>('VITE_ALGOLIA_INDEX'),
};
