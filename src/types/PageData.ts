import { CategoryType } from '@/types/CategoryType';
import { ImagePositionType } from '@/types/ImagePositionType';
import {
  TransformedArticleData,
  TransformedAuthorData,
  TransformedPostDataWithTransformedAuthors,
  TransformedTutorialData,
} from '@/types/TransformedContentTypeData';

export interface LayoutTemplateData {
  categories: ('all' | CategoryType)[];
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
    position?: ImagePositionType;
  };
  authors: TransformedAuthorData[];
  relatedPosts: TransformedPostDataWithTransformedAuthors[];
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface ArticlePageData extends CommonPostPageData, Omit<TransformedArticleData, 'authors'> {}

export interface TutorialPageData extends CommonPostPageData, Omit<TransformedTutorialData, 'authors'> {}

export type PostPageData = ArticlePageData | TutorialPageData;
