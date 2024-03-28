import { HOST_URL } from '@/constants';

export const getUrl = (path: string): string => `${HOST_URL}${path}`;
