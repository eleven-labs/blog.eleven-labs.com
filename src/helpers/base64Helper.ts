import { IS_SSR } from '@/constants';

export const encodeBase64 = (content: string): string => {
  if (IS_SSR) {
    const buffer = Buffer.from(content, 'utf-8');
    return buffer.toString('base64');
  }
  return window.btoa(unescape(encodeURIComponent(content)));
};

export const decodeBase64 = (base64Content: string): string => {
  if (IS_SSR) {
    const buffer = new Buffer(base64Content, 'base64');
    return buffer.toString('utf-8');
  }
  return decodeURIComponent(escape(window?.atob(base64Content)));
};
