import { type Resource } from 'i18next';

import { DataLayerEventAvailable } from '@/helpers/dataLayerHelper';
import { LayoutTemplateData } from '@/types';

export {};

declare global {
  interface Window {
    initialI18nStore: Resource;
    initialLanguage: string;
    layoutTemplateData: LayoutTemplateData;
    dataLayer: DataLayerEventAvailable[];
    language: string;
  }
}
