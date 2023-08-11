import { indexationAlglolia } from '@/helpers/indexationAlgoliaHelper';

indexationAlglolia({
  appId: process.env.ALGOLIA_APP_ID as string,
  apiIndexingKey: process.env.ALGOLIA_API_INDEXING_KEY as string,
  index: process.env.ALGOLIA_INDEX as string,
});
