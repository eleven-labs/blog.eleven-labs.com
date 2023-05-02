export type AuthorData = {
  username: string;
  name: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
};

export type PostData = {
  lang: string;
  date: string;
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  authors: string[];
  categories?: string[];
  keywords?: string[];
};

export interface TransformedPost
  extends Pick<PostData, 'lang' | 'slug' | 'date' | 'title' | 'excerpt' | 'authors' | 'categories'> {
  readingTime: string;
  content: string;
}

export interface TransformedAuthor extends AuthorData {
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
