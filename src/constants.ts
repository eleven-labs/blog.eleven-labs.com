import { getEnv } from '@/helpers/getEnvHelper';

export const IS_SSR = import.meta.env.SSR;
export const IS_PRERENDER = import.meta.env.MODE === 'prerender';
export const BASE_URL = getEnv<string>('BASE_URL') || '/';

export enum LanguageEnum {
  FR = 'fr',
  EN = 'en',
}

export enum CategoryEnum {
  JAVASCRIPT = 'javascript',
  PHP = 'php',
  AGILE = 'agile',
  ARCHITECTURE = 'architecture',
}

export const DEFAULT_LANGUAGE = LanguageEnum.FR;
export const NUMBER_OF_ITEMS_PER_PAGE = 6;

export const PATHS = {
  ROOT: '/',
  HOME: '/:lang/',
  PAGINATED_HOME: '/:lang/page/:page/',
  POST: '/:lang/:slug/:step?/',
  AUTHOR: '/:lang/authors/:authorUsername/',
  CATEGORY: '/:lang/categories/:categoryName/',
  SEARCH: '/:lang/search/',
};

export enum ContentTypeEnum {
  ARTICLE = 'article',
  TUTORIAL = 'tutorial',
  TUTORIAL_STEP = 'tutorial-step',
  AUTHOR = 'author',
}

export const CATEGORIES = ['javascript', 'php', 'agile', 'architecture'] as const;

export const ALGOLIA_CONFIG = {
  APP_ID: getEnv<string>('VITE_ALGOLIA_APP_ID'),
  API_KEY: getEnv<string>('VITE_ALGOLIA_API_KEY'),
  INDEX: getEnv<string>('VITE_ALGOLIA_INDEX'),
};

export const AVAILABLE_SHARE_LINKS = [
  {
    name: 'copyLink',
    isVisible: true,
  },
  {
    name: 'twitter',
    isVisible: true,
  },
  {
    name: 'facebook',
    isVisible: true,
  },
  {
    name: 'linkedIn',
    isVisible: true,
  },
  {
    name: 'reddit',
    isVisible: false,
  },
] as const;

export const GTM_ID = getEnv<string>('VITE_GTM_ID');

export const GOOGLE_SITE_VERIFICATION = getEnv<string>('VITE_GOOGLE_SITE_VERIFICATION');
