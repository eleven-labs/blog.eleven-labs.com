import { SearchIndex } from 'algoliasearch';

import { getAlgoliaSearchClient, getAlgoliaSearchIndex } from '@/helpers/algoliaHelper';
import { getPostsByLangAndAuthors } from '@/helpers/contentHelper';

const savePosts = async (options: {
  postsByLangAndAuthors: ReturnType<typeof getPostsByLangAndAuthors>;
  algoliaSearchIndex: SearchIndex;
}): Promise<string[]> => {
  const { postsByLang, authors } = options.postsByLangAndAuthors;
  const posts = Object.values(postsByLang).flat();

  const objects = posts.reduce<
    Record<
      string,
      {
        objectID: string;
        lang: string;
        slug: string;
        readingTime: string;
        title: string;
        date: string;
        date_timestamp: number;
        excerpt: string;
        categories: string[];
        authorUsernames: string[];
        authorNames: string[];
      }
    >
  >((currentPosts, post) => {
    const objectID = `${post.slug}-${post.lang}`;
    const authorsByPost = authors.filter((author) => post.authors.includes(author.username));
    currentPosts[objectID] = {
      objectID,
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
  const postsByLangAndAuthors = getPostsByLangAndAuthors();
  const algoliaSearchClient = getAlgoliaSearchClient({ appId: options.appId, apiKey: options.apiIndexingKey });
  const algoliaSearchIndex = getAlgoliaSearchIndex({ algoliaSearchClient, index: options.index });

  const objectIDs = await savePosts({ postsByLangAndAuthors, algoliaSearchIndex });
  console.info(`Number of posts indexed on algolia: ${objectIDs.length}`);

  await saveSettings({ algoliaSearchIndex });
};