import { TransformedPostData } from '@/types/TransformedContentTypeData';

interface AlgoliaData {
  objectID: string;
}

export interface AlgoliaPostData
  extends AlgoliaData,
    Pick<
      TransformedPostData,
      'contentType' | 'lang' | 'slug' | 'date' | 'readingTime' | 'title' | 'excerpt' | 'categories'
    > {
  date_timestamp: number;
  authorUsernames: string[];
  authorNames: string[];
}
