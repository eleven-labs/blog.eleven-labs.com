import { type Resource } from 'i18next';

import { DataLayerEventAvailable } from '@/helpers/dataLayerHelper';
import { getPostListDataPage } from '@/helpers/loaderDataHelper';

export {};

declare global {
  interface Window {
    initialI18nStore: Resource;
    initialLanguage: string;
    posts: ReturnType<typeof getPostListDataPage>['posts'];
    dataLayer: DataLayerEventAvailable[];
    language: string;
  }
}
