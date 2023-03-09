export type PostType = {
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
