export type AuthorData = {
  layout: 'author';
  login: string;
  title: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  permalink: string;
};

export type PostData = {
  layout: 'post';
  lang: string;
  date: string;
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  authors: string[];
  categories?: string[];
  permalink: string;
};

export interface TransformedPost
  extends Pick<PostData, 'lang' | 'slug' | 'date' | 'title' | 'excerpt' | 'authors' | 'categories'> {
  readingTime: string;
  content: string;
}

export interface TransformedAuthor extends Pick<AuthorData, 'github' | 'twitter'> {
  username: string;
  name: string;
  avatarImageUrl?: string;
  content: string;
}

type TransformedPostAuthors = Pick<TransformedAuthor, 'username' | 'name'>[];
type TransformedPostListWithoutAuthorsAndContent = Omit<TransformedPost, 'authors' | 'content'>;
type TransformedPostWithAuthors = TransformedPostListWithoutAuthorsAndContent & {
  authors: TransformedPostAuthors;
};

export interface DataFromAuthorPage {
  author: TransformedAuthor;
  posts: TransformedPostWithAuthors[];
}

export interface DataFromPostListPage {
  categories: string[];
  posts: (TransformedPostListWithoutAuthorsAndContent & { authors: TransformedPostAuthors })[];
}

export interface DataFromPostPage extends Omit<TransformedPost, 'authors'> {
  authors: TransformedAuthor[];
  relatedPosts: (TransformedPostListWithoutAuthorsAndContent & { authors: TransformedPostAuthors })[];
}
