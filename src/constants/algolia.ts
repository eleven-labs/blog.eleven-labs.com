export const algoliaConfig = {
  appId: import.meta.env.VITE_ALGOLIA_APP_ID as string,
  apiKey: import.meta.env.VITE_ALGOLIA_API_KEY as string,
  index: import.meta.env.VITE_ALGOLIA_INDEX as string,
};
