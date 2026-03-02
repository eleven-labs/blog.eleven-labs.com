import type { DEVICES } from '@/constants';

export type DeviceType = (typeof DEVICES)[keyof typeof DEVICES];
