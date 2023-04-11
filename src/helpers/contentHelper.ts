import { existsSync } from 'node:fs';
import path from 'node:path';

import { getPathFile } from '@/helpers/assetHelper';
import type { AuthorType, PostType } from '@/types';

const readingTimeToString = (numberOfWords: number): string => {
  const readingTimeInMinutes = numberOfWords < 360 ? 1 : Math.round(numberOfWords / 180);
  return `${readingTimeInMinutes}mn`;
};

export const getPosts = (): (Pick<
  PostType,
  'lang' | 'slug' | 'date' | 'title' | 'excerpt' | 'authors' | 'categories'
> & {
  readingTime: string;
  content: string;
})[] => {
  const postsModules = import.meta.glob<{
    attributes: PostType;
    content: string;
  }>('../../_posts/**/*.md', { eager: true });

  return Object.entries(postsModules)
    .reduce<ReturnType<typeof getPosts>>((posts, [_, { attributes, content }]) => {
      const numberOfWords = content.split(' ').length;

      return [
        ...posts,
        {
          lang: attributes.lang,
          slug: attributes.slug,
          date: new Date(attributes.date).toISOString(),
          title: attributes.title,
          excerpt: attributes.excerpt,
          readingTime: readingTimeToString(numberOfWords),
          authors: attributes.authors,
          categories: attributes.categories,
          content: content,
        },
      ];
    }, [])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getAuthors = (): (Pick<AuthorType, 'github' | 'twitter'> & {
  username: string;
  name: string;
  avatarImageUrl?: string;
  description: string;
})[] => {
  const authorModules = import.meta.glob<{
    attributes: {
      login: string;
      title: string;
      twitter?: string;
      github?: string;
    };
    content: string;
  }>('../../_authors/**/*.md', { eager: true });

  return Object.entries(authorModules).reduce<ReturnType<typeof getAuthors>>(
    (authors, [_, { attributes, content }]) => {
      const avatarImageExist = existsSync(
        path.resolve(process.cwd(), 'public/imgs/authors', `${attributes.login}.jpg`)
      );

      authors.push({
        username: attributes.login,
        name: attributes.title,
        github: attributes?.github,
        twitter: attributes?.twitter,
        avatarImageUrl: avatarImageExist
          ? getPathFile(`/imgs/authors/${attributes.login}.jpg`)
          : getPathFile('/imgs/astronaut.png'),
        description: content,
      });

      return authors;
    },
    []
  );
};
