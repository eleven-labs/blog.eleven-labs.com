import { DEVICES } from '@/constants';

export type DeviceType = (typeof DEVICES)[keyof typeof DEVICES];
