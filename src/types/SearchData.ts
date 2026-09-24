import type { TransformedPostData } from '@/types/TransformedContentTypeData';

export interface SearchPostData
  extends Pick<
    TransformedPostData,
    'contentType' | 'lang' | 'slug' | 'date' | 'readingTime' | 'title' | 'excerpt' | 'categories' | 'cover'
  > {
  authorUsernames: string[];
  authorNames: string[];
}
