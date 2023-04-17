import { BASE_URL } from '@/constants';

export const getPathFile = (path: string): string => `${BASE_URL}${path.slice(1)}`;
