import { IMAGE_FORMATS } from '@/constants';

export type ImageFormatType = (typeof IMAGE_FORMATS)[keyof typeof IMAGE_FORMATS];
