import type { PictureProps } from '@eleven-labs/design-system';

import { BASE_URL, DeviceEnum, IMAGE_FORMATS, ImageFormatEnum } from '@/constants';
import { TransformedPostDataWithTransformedAuthors } from '@/types';

const basename = (path: string, extension: string = ''): string => {
  const filename = path.split('/').pop() || '';
  const extensionLength = extension.startsWith('.') ? extension.length : extension.length + 1;
  return filename.slice(0, filename.length - extensionLength);
};
const dirname = (path: string): string => path.split('/').slice(0, -1).join('/') || '';
const extname = (path: string): string => path.split('.').pop() || '';

export const getPathFile = (path: string): string => `${BASE_URL}${path.slice(1)}`;

export const getCoverPath = ({
  path = '/imgs/default-cover.jpg',
  format,
  device,
  pixelRatio = 1,
}: {
  path?: string;
  format: ImageFormatEnum;
  device: DeviceEnum;
  pixelRatio?: number;
}): string => {
  const isProd: boolean = process.env.NODE_ENV === 'production';
  const directoryPath = dirname(path);
  const filename = basename(path, extname(path));
  const imageFormat = IMAGE_FORMATS[device][format];

  const pathFile = isProd
    ? `${directoryPath}/${filename}-w${imageFormat.width * pixelRatio}-h${imageFormat.height * pixelRatio}.avif`
    : `${path}?width=${imageFormat.width * pixelRatio}&height=${imageFormat.height * pixelRatio}&format=avif`;

  return getPathFile(pathFile);
};

export const getCover = (post: TransformedPostDataWithTransformedAuthors, format: ImageFormatEnum): PictureProps => ({
  sources: [
    {
      media: '(max-width: 571px)',
      srcSet: `${getCoverPath({
        path: post.cover?.path,
        format,
        pixelRatio: 2,
        device: DeviceEnum.MOBILE,
      })} 2x`,
      type: 'image/jpeg',
    },
    {
      media: '(min-width: 572px)',
      srcSet: `${getCoverPath({
        path: post.cover?.path,
        format,
        pixelRatio: 2,
        device: DeviceEnum.DESKTOP,
      })} 2x`,
      type: 'image/jpeg',
    },
  ],
  img: {
    src: getCoverPath({
      path: post.cover?.path,
      format,
      pixelRatio: 2,
      device: DeviceEnum.DESKTOP,
    }),
    alt: post.cover?.alt ?? post.title,
    width: IMAGE_FORMATS[DeviceEnum.DESKTOP][format].width,
    height: IMAGE_FORMATS[DeviceEnum.DESKTOP][format].height,
    loading: 'eager',
    decoding: 'sync',
  },
});
