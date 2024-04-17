import type { PictureProps } from '@eleven-labs/design-system';

import {
  BASE_URL,
  DEFAULT_EXTENSION_FOR_IMAGES,
  DEVICES,
  HOST_URL,
  IMAGE_CONTENT_TYPES,
  IMAGE_POSITIONS,
  SIZES_BY_IMAGE_FORMAT,
} from '@/constants';
import {
  DeviceType,
  ImageExtensionType,
  ImageFormatType,
  ImagePositionType,
  TransformedPostDataWithTransformedAuthors,
} from '@/types';

const basename = (path: string, extension: string = ''): string => {
  const filename = path.split('/').pop() || '';
  const extensionLength = extension.startsWith('.') ? extension.length : extension.length + 1;
  return filename.slice(0, filename.length - extensionLength);
};
const dirname = (path: string): string => path.split('/').slice(0, -1).join('/') || '';
const extname = (path: string): string => path.split('.').pop() || '';

export const getPathFile = (path: string): string => `${BASE_URL}${path.slice(1)}`;

export const generateUrl = (path: string): string => `${HOST_URL}${path}`;

export const getCoverPath = ({
  path = '/imgs/default-cover.jpg',
  format,
  device,
  pixelRatio,
  extension = DEFAULT_EXTENSION_FOR_IMAGES,
  position = IMAGE_POSITIONS.CENTER,
}: {
  path?: string;
  format: ImageFormatType;
  device: DeviceType;
  pixelRatio: number;
  extension?: ImageExtensionType;
  position?: ImagePositionType;
}): string => {
  const isProd: boolean = process.env.NODE_ENV === 'production';
  const directoryPath = dirname(path);
  const filename = basename(path, extname(path));
  const imageFormat = SIZES_BY_IMAGE_FORMAT[device][format];

  const pathFile = isProd
    ? `${directoryPath}/${filename}-w${imageFormat.width}-h${imageFormat.height}-x${pixelRatio}.${extension}`
    : `${path}?width=${imageFormat.width}&height=${imageFormat.height}&pixelRatio=${pixelRatio}&position=${position}&format=${extension}`;

  return getPathFile(pathFile);
};

export const getSrcSet = (
  options: Omit<Parameters<typeof getCoverPath>[0], 'pixelRatio'> & { pixelRatios: number[] }
): string =>
  options.pixelRatios.map((pixelRatio) => `${getCoverPath({ ...options, pixelRatio })} ${pixelRatio}x`).join(', ');

export const getMediaByDevice = (device: DeviceType): string =>
  device === DEVICES.DESKTOP ? '(min-width: 572px)' : '(max-width: 571px)';

export const getSources = (options: {
  path?: string;
  format: ImageFormatType;
  position?: ImagePositionType;
}): PictureProps['sources'] =>
  Object.values(DEVICES).map((device) => ({
    media: getMediaByDevice(device),
    srcSet: getSrcSet({
      path: options.path,
      format: options.format,
      device,
      pixelRatios: [2, 1],
      position: options.position,
    }),
    type: IMAGE_CONTENT_TYPES[DEFAULT_EXTENSION_FOR_IMAGES],
  }));

export const getCover = (post: TransformedPostDataWithTransformedAuthors, format: ImageFormatType): PictureProps => ({
  sources: getSources({ path: post.cover?.path, format, position: post?.cover?.position as ImagePositionType }),
  img: {
    src: getCoverPath({
      path: post.cover?.path,
      format,
      pixelRatio: 1,
      device: DEVICES.DESKTOP,
      position: post?.cover?.position as ImagePositionType,
    }),
    alt: post.cover?.alt ?? post.title,
    width: SIZES_BY_IMAGE_FORMAT[DEVICES.DESKTOP][format].width,
    height: SIZES_BY_IMAGE_FORMAT[DEVICES.DESKTOP][format].height,
    loading: 'eager',
    decoding: 'sync',
    fetchPriority: 'high',
  },
});
