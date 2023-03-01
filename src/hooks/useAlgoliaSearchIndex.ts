import { algoliaConfig } from '@/constants';
import { getAlgoliaSearchClient, getAlgoliaSearchIndex } from '@/helpers/algoliaHelper';

export const useAlgoliaSearchIndex = (): ReturnType<typeof getAlgoliaSearchIndex> => {
  const algoliaSearchClient = getAlgoliaSearchClient({
    appId: algoliaConfig.appId,
    apiKey: algoliaConfig.apiKey,
  });

  return getAlgoliaSearchIndex({
    algoliaSearchClient,
    index: algoliaConfig.index,
  });
};
