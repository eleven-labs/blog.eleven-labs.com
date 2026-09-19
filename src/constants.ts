import type { DeviceType, ImageExtensionType, ImageFormatType } from '@/types';

import { getEnv } from '@/helpers/getEnvHelper';

export const IS_SSR = import.meta.env?.SSR ?? false;
export const IS_PRERENDER = import.meta.env?.MODE === 'prerender';
export const HOST_URL = getEnv<string>('VITE_HOST_URL') || 'https://blog.eleven-labs.com';
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
  HIGHLIGHTED_POST_CARD_COVER: 'highlighted-post-card-cover',
  POST_CARD_COVER: 'post-card-cover',
  POST_COVER: 'post-cover',
} as const;

export const DEVICES = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
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

// Every cover shares the same 16/9 ratio, whatever the placement and the device,
// so a single source image framed once feeds the article hero, the list cards and
// the highlighted cards alike.
export const SIZES_BY_IMAGE_FORMAT: Record<
  DeviceType,
  Record<ImageFormatType, { width: number; height: number; extension?: ImageExtensionType }>
> = {
  [DEVICES.DESKTOP]: {
    [IMAGE_FORMATS.HIGHLIGHTED_POST_CARD_COVER]: {
      width: 400,
      height: 225,
    },
    [IMAGE_FORMATS.POST_CARD_COVER]: {
      width: 288,
      height: 162,
    },
    [IMAGE_FORMATS.POST_COVER]: {
      width: 800,
      height: 450,
    },
  },
  [DEVICES.TABLET]: {
    [IMAGE_FORMATS.HIGHLIGHTED_POST_CARD_COVER]: {
      width: 640,
      height: 360,
    },
    [IMAGE_FORMATS.POST_CARD_COVER]: {
      width: 288,
      height: 162,
    },
    [IMAGE_FORMATS.POST_COVER]: {
      width: 640,
      height: 360,
    },
  },
  [DEVICES.MOBILE]: {
    [IMAGE_FORMATS.HIGHLIGHTED_POST_CARD_COVER]: {
      width: 368,
      height: 207,
    },
    [IMAGE_FORMATS.POST_CARD_COVER]: {
      width: 368,
      height: 207,
    },
    [IMAGE_FORMATS.POST_COVER]: {
      width: 368,
      height: 207,
    },
  },
} as const;

// Dedicated format for social previews: Open Graph ratio (1.91:1) and JPEG, since
// Facebook, LinkedIn and X cannot read the AVIF served to the browser.
export const SOCIAL_IMAGE_FORMAT: { width: number; height: number; extension: ImageExtensionType } = {
  width: 1200,
  height: 630,
  extension: 'jpeg',
};
