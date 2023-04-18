jest.mock('./src/constants', () => ({
  IS_SSR: false,
  IS_PRERENDER: false,
  BASE_URL: '/',
  AUTHORIZED_LANGUAGES: ['fr', 'en'],
  CATEGORIES: ['javascript', 'php', 'agile', 'architecture'],
}));
