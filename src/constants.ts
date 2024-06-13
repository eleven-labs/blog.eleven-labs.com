import { getEnv } from '@/helpers/getEnvHelper';
import { DeviceType, ImageExtensionType, ImageFormatType } from '@/types';

export const IS_SSR = import.meta.env?.SSR ?? false;
export const IS_PRERENDER = import.meta.env?.MODE === 'prerender';
export const HOST_URL = getEnv<string>('VITE_HOST_URL') || 'https://blog.eleven-labs.com';
export const IS_ENV_PRODUCTION = HOST_URL === 'https://blog.eleven-labs.com';
export const BASE_URL = import.meta.env?.BASE_URL || '/';

export const IS_DEBUG = getEnv<string>('VITE_IS_DEBUG') === 'true';

export const LANGUAGES = {
  FR: 'fr',
  EN: 'en',
  DT: 'dt',
} as const;

export const LANGUAGES_AVAILABLE = [LANGUAGES.FR, LANGUAGES.EN] as const;
export const LANGUAGES_AVAILABLE_WITH_DT = IS_DEBUG ? [...LANGUAGES_AVAILABLE, LANGUAGES.DT] : LANGUAGES_AVAILABLE;

export const MARKDOWN_CONTENT_TYPES = {
  ARTICLE: 'article',
  TUTORIAL: 'tutorial',
  TUTORIAL_STEP: 'tutorial-step',
  AUTHOR: 'author',
} as const;

export const CATEGORIES = ['javascript', 'php', 'agile', 'architecture'] as const;

export const DEFAULT_LANGUAGE = LANGUAGES.FR;
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

export const IMAGE_FORMATS = {
  HIGHLIGHTED_ARTICLE_POST_CARD_COVER: 'highlighted-article-post-card-cover',
  HIGHLIGHTED_TUTORIAL_POST_CARD_COVER: 'highlighted-tutorial-post-card-cover',
  POST_CARD_COVER: 'post-card-cover',
  POST_COVER: 'post-cover',
} as const;

export const DEVICES = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
} as const;

export const IMAGE_CONTENT_TYPES = {
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  png: 'image/png',
  avif: 'image/avif',
} as const;

export const IMAGE_POSITIONS = {
  TOP: 'top',
  RIGHT_AND_TOP: 'right top',
  RIGHT: 'right',
  RIGHT_BOTTOM: 'right bottom',
  BOTTOM: 'bottom',
  LEFT_AND_BOTTOM: 'left bottom',
  LEFT: 'left',
  LEFT_TOP: 'left top',
  CENTER: 'center',
  NORTH: 'north',
  NORTHEAST: 'northeast',
  EAST: 'east',
  SOUTHEAST: 'southeast',
  SOUTH: 'south',
  SOUTHWEST: 'southwest',
  WEST: 'west',
  NORTHWEST: 'northwest',
} as const;

export const DEFAULT_EXTENSION_FOR_IMAGES: ImageExtensionType = 'avif';

export const SIZES_BY_IMAGE_FORMAT: Record<DeviceType, Record<ImageFormatType, { width: number; height: number }>> = {
  [DEVICES.DESKTOP]: {
    [IMAGE_FORMATS.HIGHLIGHTED_ARTICLE_POST_CARD_COVER]: {
      width: 385,
      height: 175,
    },
    [IMAGE_FORMATS.HIGHLIGHTED_TUTORIAL_POST_CARD_COVER]: {
      width: 400,
      height: 245,
    },
    [IMAGE_FORMATS.POST_CARD_COVER]: {
      width: 190,
      height: 190,
    },
    [IMAGE_FORMATS.POST_COVER]: {
      width: 1200,
      height: 330,
    },
  },
  [DEVICES.MOBILE]: {
    [IMAGE_FORMATS.HIGHLIGHTED_ARTICLE_POST_CARD_COVER]: {
      width: 67,
      height: 67,
    },
    [IMAGE_FORMATS.HIGHLIGHTED_TUTORIAL_POST_CARD_COVER]: {
      width: 328,
      height: 130,
    },
    [IMAGE_FORMATS.POST_CARD_COVER]: {
      width: 67,
      height: 67,
    },
    [IMAGE_FORMATS.POST_COVER]: {
      width: 330,
      height: 160,
    },
  },
} as const;
