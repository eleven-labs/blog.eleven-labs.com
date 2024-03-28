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

export enum ImageFormatEnum {
  HIGHLIGHTED_ARTICLE_POST_CARD_COVER = 'highlighted-article-post-card-cover',
  HIGHLIGHTED_TUTORIAL_POST_CARD_COVER = 'highlighted-tutorial-post-card-cover',
  POST_CARD_COVER = 'post-card-cover',
  POST_COVER = 'post-cover',
}

export enum DeviceEnum {
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
}

export const IMAGE_FORMATS: Record<DeviceEnum, Record<ImageFormatEnum, { width: number; height: number }>> = {
  mobile: {
    [ImageFormatEnum.HIGHLIGHTED_ARTICLE_POST_CARD_COVER]: {
      width: 67,
      height: 67,
    },
    [ImageFormatEnum.HIGHLIGHTED_TUTORIAL_POST_CARD_COVER]: {
      width: 328,
      height: 130,
    },
    [ImageFormatEnum.POST_CARD_COVER]: {
      width: 67,
      height: 67,
    },
    [ImageFormatEnum.POST_COVER]: {
      width: 330,
      height: 160,
    },
  },
  desktop: {
    [ImageFormatEnum.HIGHLIGHTED_ARTICLE_POST_CARD_COVER]: {
      width: 385,
      height: 175,
    },
    [ImageFormatEnum.HIGHLIGHTED_TUTORIAL_POST_CARD_COVER]: {
      width: 400,
      height: 245,
    },
    [ImageFormatEnum.POST_CARD_COVER]: {
      width: 190,
      height: 190,
    },
    [ImageFormatEnum.POST_COVER]: {
      width: 1200,
      height: 330,
    },
  },
} as const;
