import {
  TransformedArticleData,
  TransformedAuthorData,
  TransformedPostDataWithTransformedAuthors,
  TransformedTutorialData,
} from '@/types/TransformedContentTypeData';

export interface AuthorPageData {
  author: TransformedAuthorData;
  posts: TransformedPostDataWithTransformedAuthors[];
}
export interface PostListPageData {
  categories: string[];
  posts: TransformedPostDataWithTransformedAuthors[];
}

interface CommonPostPageData {
  authors: TransformedAuthorData[];
  relatedPosts: TransformedPostDataWithTransformedAuthors[];
}

export interface ArticlePageData extends CommonPostPageData, Omit<TransformedArticleData, 'authors'> {}

export interface TutorialPageData extends CommonPostPageData, Omit<TransformedTutorialData, 'authors'> {}

export type PostPageData = ArticlePageData | TutorialPageData;
