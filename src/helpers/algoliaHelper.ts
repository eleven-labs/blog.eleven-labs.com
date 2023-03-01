import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';

export const getAlgoliaSearchClient = (options: { appId: string; apiKey: string }): SearchClient =>
  algoliasearch(options.appId, options.apiKey);

export const getAlgoliaSearchIndex = (options: { algoliaSearchClient: SearchClient; index: string }): SearchIndex =>
  options.algoliaSearchClient.initIndex(options.index);
