import { ArticleData, AuthorData, TutorialData, TutorialStepData } from './ContentTypeData';

export interface TransformedArticleData
  extends Pick<ArticleData, 'lang' | 'slug' | 'cover' | 'title' | 'excerpt' | 'authors' | 'categories'> {
  contentType: 'article';
  summary: { id: string; level: number; text: string }[];
  date: string;
  readingTime: number;
  content: string;
}

export interface TransformedTutorialData
  extends Pick<TutorialData, 'lang' | 'slug' | 'cover' | 'title' | 'excerpt' | 'authors' | 'categories'> {
  contentType: 'tutorial';
  date: string;
  readingTime: number;
  steps: (Pick<TutorialStepData, 'slug' | 'title'> & { content: string; readingTime: number })[];
}

export type TransformedPostData = TransformedArticleData | TransformedTutorialData;

export interface TransformedAuthorData extends Pick<AuthorData, 'username' | 'name'> {
  avatarImageUrl?: string;
  content: string;
  socialNetworks?: Pick<AuthorData, 'github' | 'linkedin' | 'twitter'>;
}

export type TransformedPostDataWithoutContent =
  | Omit<TransformedArticleData, 'content'>
  | Omit<TransformedTutorialData, 'steps'>;

export type TransformedPostDataWithTransformedAuthors = Omit<TransformedPostDataWithoutContent, 'authors'> & {
  authors: Pick<TransformedAuthorData, 'username' | 'name'>[];
};
