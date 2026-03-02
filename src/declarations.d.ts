import type { DataLayerEventAvailable } from '@/helpers/dataLayerHelper';
import type { LayoutTemplateData } from '@/types';

import { type Resource } from 'i18next';

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
