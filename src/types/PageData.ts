import { CategoryEnum } from '@/constants';
import {
  TransformedArticleData,
  TransformedAuthorData,
  TransformedPostDataWithTransformedAuthors,
  TransformedTutorialData,
} from '@/types/TransformedContentTypeData';

export interface LayoutTemplateData {
  categories: ('all' | CategoryEnum)[];
  hasTutorial: boolean;
}

export interface AuthorPageData {
  author: TransformedAuthorData;
  posts: TransformedPostDataWithTransformedAuthors[];
}
export interface PostListPageData {
  posts: TransformedPostDataWithTransformedAuthors[];
}

interface CommonPostPageData {
  cover?: {
    path: string;
    alt: string;
  };
  authors: TransformedAuthorData[];
  relatedPosts: TransformedPostDataWithTransformedAuthors[];
}

export interface ArticlePageData extends CommonPostPageData, Omit<TransformedArticleData, 'authors'> {}

export interface TutorialPageData extends CommonPostPageData, Omit<TransformedTutorialData, 'authors'> {}

export type PostPageData = ArticlePageData | TutorialPageData;
