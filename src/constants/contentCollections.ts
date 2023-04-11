import { CATEGORIES } from '@/constants/categories';
import { getAuthors, getPosts } from '@/helpers/contentHelper';

export const contentCollections = {
  categories: CATEGORIES,
  posts: getPosts(),
  authors: getAuthors(),
};
