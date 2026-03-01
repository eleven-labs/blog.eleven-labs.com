import type { LANGUAGES } from '@/constants';

export type LanguageType = (typeof LANGUAGES)[keyof typeof LANGUAGES];
