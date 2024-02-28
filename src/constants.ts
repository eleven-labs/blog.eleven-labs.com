import { getEnv } from '@/helpers/getEnvHelper';

export const IS_SSR = import.meta.env?.SSR ?? false;
export const IS_PRERENDER = import.meta.env?.MODE === 'prerender';
export const HOST_URL = getEnv<string>('VITE_HOST_URL') || 'https://blog.eleven-labs.com';
export const BASE_URL = import.meta.env?.BASE_URL || '/';

export const IS_DEBUG = getEnv<string>('VITE_IS_DEBUG') === 'true';

export enum LanguageEnum {
  FR = 'fr',
  EN = 'en',
  DT = 'dt',
}

export const LANGUAGES_AVAILABLE = [LanguageEnum.FR, LanguageEnum.EN] as const;
export const LANGUAGES_AVAILABLE_WITH_DT = IS_DEBUG ? [...LANGUAGES_AVAILABLE, LanguageEnum.DT] : LANGUAGES_AVAILABLE;

export enum ContentTypeEnum {
  ARTICLE = 'article',
  TUTORIAL = 'tutorial',
  TUTORIAL_STEP = 'tutorial-step',
  AUTHOR = 'author',
}

export const CATEGORIES = ['javascript', 'php', 'agile', 'architecture'] as const;
export type CategoryEnum = (typeof CATEGORIES)[number];

export const DEFAULT_LANGUAGE = LanguageEnum.FR;
export const NUMBER_OF_ITEMS_FOR_SEARCH = 6;
export const NUMBER_OF_ITEMS_PER_PAGE = 12;

export const PATHS = {
  ROOT: '/',
  HOME: '/:lang/',
  POST: '/:lang/:slug/:step?/',
  AUTHOR: '/:lang/authors/:authorUsername/',
  AUTHOR_PAGINATED: '/:lang/authors/:authorUsername/pages/:page/',
  CATEGORY: '/:lang/categories/:categoryName/',
  CATEGORY_PAGINATED: '/:lang/categories/:categoryName/pages/:page/',
  SEARCH: '/:lang/search/',
};

export const ALGOLIA_CONFIG = {
  APP_ID: getEnv<string>('VITE_ALGOLIA_APP_ID'),
  API_KEY: getEnv<string>('VITE_ALGOLIA_API_KEY'),
  INDEX: getEnv<string>('VITE_ALGOLIA_INDEX'),
};

export const GTM_ID = getEnv<string>('VITE_GTM_ID');

export const GOOGLE_SITE_VERIFICATION = getEnv<string>('VITE_GOOGLE_SITE_VERIFICATION');
