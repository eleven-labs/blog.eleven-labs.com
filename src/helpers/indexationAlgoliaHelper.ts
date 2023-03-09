import { SearchIndex } from 'algoliasearch';

import { getAlgoliaSearchClient, getAlgoliaSearchIndex } from '@/helpers/algoliaHelper';
import { getData } from '@/helpers/dataHelper';

const savePosts = async (options: {
  data: ReturnType<typeof getData>;
  algoliaSearchIndex: SearchIndex;
}): Promise<string[]> => {
  const objects = options.data.posts.reduce<
    Record<
      string,
      {
        objectID: string;
        lang: string;
        slug: string;
        title: string;
        date: string;
        excerpt: string;
        categories: string[];
        authorUsernames: string[];
        authorNames: string[];
      }
    >
  >((currentPosts, post) => {
    const objectID = `${post.slug}-${post.lang}`;
    const authorsByPost = options.data.authors.filter((author) => post.authors.includes(author.username));
    currentPosts[objectID] = {
      objectID,
      lang: post.lang,
      slug: post.slug,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      categories: post.categories || [],
      authorUsernames: authorsByPost.map((author) => author.username),
      authorNames: authorsByPost.map((author) => author.name),
    };

    return currentPosts;
  }, {});

  const { objectIDs } = await options.algoliaSearchIndex.saveObjects(Object.values(objects));
  return objectIDs;
};

const saveSettings = async (options: { algoliaSearchIndex: SearchIndex }): Promise<void> => {
  await options.algoliaSearchIndex.setSettings({
    searchableAttributes: ['title', 'categories', 'authorUsernames', 'authorNames', 'excerpt'],
    attributesForFaceting: ['lang'],
  });
};

export const indexationAlglolia = async (options: {
  appId: string;
  apiIndexingKey: string;
  index: string;
}): Promise<void> => {
  const data = getData();
  const algoliaSearchClient = getAlgoliaSearchClient({ appId: options.appId, apiKey: options.apiIndexingKey });
  const algoliaSearchIndex = getAlgoliaSearchIndex({ algoliaSearchClient, index: options.index });

  const objectIDs = await savePosts({ data, algoliaSearchIndex });
  console.info(`Number of posts indexed on algolia: ${objectIDs.length}`);

  await saveSettings({ algoliaSearchIndex });
};
