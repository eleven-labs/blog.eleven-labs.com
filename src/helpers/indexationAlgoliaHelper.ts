import { SearchIndex } from 'algoliasearch';

import { getAlgoliaSearchClient, getAlgoliaSearchIndex } from '@/helpers/algoliaHelper';
import { getAuthors, getPosts } from '@/helpers/markdownContentManagerHelper';
import { AlgoliaPostData, TransformedAuthorData, TransformedPostData } from '@/types';

const savePosts = async (options: {
  posts: TransformedPostData[];
  authors: TransformedAuthorData[];
  algoliaSearchIndex: SearchIndex;
}): Promise<string[]> => {
  const objects = options.posts.reduce<Record<string, AlgoliaPostData>>((currentPosts, post) => {
    const objectID = `${post.slug}-${post.lang}`;
    const authorsByPost = options.authors.filter((author) => post.authors.includes(author.username));
    currentPosts[objectID] = {
      objectID,
      contentType: post.contentType,
      lang: post.lang,
      slug: post.slug,
      readingTime: post.readingTime,
      title: post.title,
      date: post.date,
      date_timestamp: new Date(post.date).getTime(),
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
    ranking: ['desc(date_timestamp)'],
  });
};

export const indexationAlglolia = async (options: {
  appId: string;
  apiIndexingKey: string;
  index: string;
}): Promise<void> => {
  const posts = getPosts();
  const authors = getAuthors();

  const algoliaSearchClient = getAlgoliaSearchClient({ appId: options.appId, apiKey: options.apiIndexingKey });
  const algoliaSearchIndex = getAlgoliaSearchIndex({ algoliaSearchClient, index: options.index });

  const objectIDs = await savePosts({ posts, authors, algoliaSearchIndex });
  console.info(`Number of posts indexed on algolia: ${objectIDs.length}`);

  await saveSettings({ algoliaSearchIndex });
};
