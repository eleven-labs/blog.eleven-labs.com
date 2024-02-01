import { CategoryEnum, ContentTypeEnum } from '@/constants';
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
  categories: ('all' | CategoryEnum | ContentTypeEnum.TUTORIAL)[];
  posts: TransformedPostDataWithTransformedAuthors[];
}

interface CommonPostPageData {
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
