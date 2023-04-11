import { contentCollections } from '@/constants/contentCollections';
import { intersection } from '@/helpers/objectHelper';

const getCategoriesByLang = (options: { lang: string }): string[] => [
  'all',
  ...contentCollections.categories.filter((currentCategoryName) =>
    contentCollections.posts.find(
      (post) => post.lang === options.lang && post?.categories?.includes(currentCategoryName)
    )
  ),
];

const getPostsByLang = (options: { lang: string }): typeof contentCollections.posts =>
  contentCollections.posts.filter((post) => post.lang === options.lang);

const getPost = (options: { lang: string; slug: string }): (typeof contentCollections.posts)[0] =>
  contentCollections.posts.find(
    (post) => post.lang === options.lang && post.slug === options.slug
  ) as (typeof contentCollections.posts)[0];

const transformPost = (options: {
  post: Exclude<ReturnType<typeof getPost>, undefined>;
  authors: typeof contentCollections.authors;
}): Omit<ReturnType<typeof getPost>, 'authors'> & {
  authors: string[];
} => ({
  ...options.post,
  authors: options.authors
    .filter((author) => options.post.authors.includes(author.username))
    .map((author) => author.name),
});

export const getPostListDataPage = (options: {
  lang: string;
  categoryName?: string;
}): {
  categories: ReturnType<typeof getCategoriesByLang>;
  posts: Omit<ReturnType<typeof transformPost>, 'content'>[];
} => ({
  categories: getCategoriesByLang({ lang: options.lang }),
  posts: getPostsByLang({ lang: options.lang })
    .filter((post) => (options.categoryName ? (post.categories || []).includes(options.categoryName) : true))
    .map((post) => {
      const { content, ...postTransformed } = transformPost({ post, authors: contentCollections.authors });
      return postTransformed;
    }),
});

export const getPostDataPage = (options: {
  lang: string;
  slug: string;
}):
  | (Omit<ReturnType<typeof getPostsByLang>[0], 'authors'> & {
      authors: typeof contentCollections.authors;
      relatedPosts: ReturnType<typeof transformPost>[];
    })
  | undefined => {
  const post = getPost({ lang: options.lang, slug: options.slug });

  if (post) {
    const postsByLang = getPostsByLang({ lang: options.lang });
    const relatedPostsByCategory = post.categories
      ? postsByLang
          .filter(
            (currentPost) =>
              currentPost.slug !== post.slug &&
              intersection(post.categories || [], currentPost.categories || []).length > 0
          )
          .slice(0, 3)
      : [];

    const relatedPostsByAuthor = postsByLang
      .filter(
        (currentPost) => currentPost.slug !== post.slug && intersection(post.authors, currentPost.authors).length > 0
      )
      .slice(0, 3);
    const relatedPosts = [...relatedPostsByCategory, ...relatedPostsByAuthor].slice(0, 3);

    return {
      ...post,
      authors: contentCollections.authors.filter((author) => post.authors.includes(author.username)),
      relatedPosts: relatedPosts.map((relatedPost) =>
        transformPost({ post: relatedPost, authors: contentCollections.authors })
      ),
    };
  }
};

export const getAuthorDataPage = (options: {
  lang: string;
  authorUsername: string;
}): (typeof contentCollections.authors)[0] & { posts: ReturnType<typeof transformPost>[] } => {
  const author = contentCollections.authors.find((currentAuthor) => currentAuthor.username === options.authorUsername)!;
  const postsByLang = getPostsByLang({ lang: options.lang });

  return {
    ...author,
    posts: postsByLang
      .filter((post) => post.authors.includes(options.authorUsername))
      .map((post) => transformPost({ post, authors: contentCollections.authors })),
  };
};
