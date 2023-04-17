import { ALGOLIA_CONFIG } from '@/constants';
import { getAlgoliaSearchClient, getAlgoliaSearchIndex } from '@/helpers/algoliaHelper';

export const useAlgoliaSearchIndex = (): ReturnType<typeof getAlgoliaSearchIndex> => {
  const algoliaSearchClient = getAlgoliaSearchClient({
    appId: ALGOLIA_CONFIG.APP_ID,
    apiKey: ALGOLIA_CONFIG.API_KEY,
  });

  return getAlgoliaSearchIndex({
    algoliaSearchClient,
    index: ALGOLIA_CONFIG.INDEX,
  });
};
