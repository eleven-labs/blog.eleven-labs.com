import { IMAGE_POSITIONS } from '@/constants';

export type ImagePositionType = (typeof IMAGE_POSITIONS)[keyof typeof IMAGE_POSITIONS];
