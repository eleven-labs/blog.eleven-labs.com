import type { PictureProps } from '@eleven-labs/design-system';

import type {
  DeviceType,
  ImageExtensionType,
  ImageFormatType,
  ImagePositionType,
  TransformedPostDataWithTransformedAuthors,
} from '@/types';

import {
  BASE_URL,
  DEFAULT_EXTENSION_FOR_IMAGES,
  DEVICES,
  HOST_URL,
  IMAGE_CONTENT_TYPES,
  IMAGE_POSITIONS,
  SIZES_BY_IMAGE_FORMAT,
  SOCIAL_IMAGE_FORMAT,
} from '@/constants';

const basename = (path: string, extension: string = ''): string => {
  const filename = path.split('/').pop() || '';
  const extensionLength = extension.startsWith('.') ? extension.length : extension.length + 1;
  return filename.slice(0, filename.length - extensionLength);
};
const dirname = (path: string): string => path.split('/').slice(0, -1).join('/') || '';
const extname = (path: string): string => path.split('.').pop() || '';

const DEFAULT_COVER_PATH = '/imgs/default-cover.jpg';

export const getPathFile = (path: string): string => `${BASE_URL}${path.slice(1)}`;

export const generateUrl = (path: string): string => `${HOST_URL}${path}`;

const buildCoverPath = ({
  path,
  width,
  height,
  pixelRatio,
  extension,
  position,
}: {
  path: string;
  width: number;
  height: number;
  pixelRatio: number;
  extension: ImageExtensionType;
  position: ImagePositionType;
}): string => {
  const isProd: boolean = process.env.NODE_ENV === 'production';
  const directoryPath = dirname(path);
  const filename = basename(path, extname(path));

  return isProd
    ? `${directoryPath}/${filename}-w${width}-h${height}-x${pixelRatio}.${extension}`
    : `${path}?width=${width}&height=${height}&pixelRatio=${pixelRatio}&position=${position}&format=${extension}`;
};

export const getCoverPath = ({
  path = DEFAULT_COVER_PATH,
  format,
  device,
  pixelRatio,
  extension,
  position = IMAGE_POSITIONS.CENTER,
}: {
  path?: string;
  format: ImageFormatType;
  device: DeviceType;
  pixelRatio: number;
  extension?: ImageExtensionType;
  position?: ImagePositionType;
}): string => {
  const imageFormat = SIZES_BY_IMAGE_FORMAT[device][format];

  return buildCoverPath({
    path,
    width: imageFormat.width,
    height: imageFormat.height,
    pixelRatio,
    extension: extension ?? imageFormat.extension ?? DEFAULT_EXTENSION_FOR_IMAGES,
    position,
  });
};

export const getSocialCoverPath = ({
  path = DEFAULT_COVER_PATH,
  position = IMAGE_POSITIONS.CENTER,
}: {
  path?: string;
  position?: ImagePositionType;
}): string =>
  buildCoverPath({
    path,
    width: SOCIAL_IMAGE_FORMAT.width,
    height: SOCIAL_IMAGE_FORMAT.height,
    pixelRatio: 1,
    extension: SOCIAL_IMAGE_FORMAT.extension,
    position,
  });

export const getSrcSet = (
  options: Omit<Parameters<typeof getCoverPath>[0], 'pixelRatio'> & { pixelRatios: number[] }
): string =>
  options.pixelRatios
    .map((pixelRatio) => `${getPathFile(getCoverPath({ ...options, pixelRatio }))} ${pixelRatio}x`)
    .join(', ');

// Kept in sync with the design system breakpoints (sm: 571px, md: 1001px) so the
// downloaded file always matches the layout actually rendered at that width.
export const MEDIA_BY_DEVICE: Record<DeviceType, string> = {
  [DEVICES.DESKTOP]: '(min-width: 1001px)',
  [DEVICES.TABLET]: '(min-width: 572px) and (max-width: 1000px)',
  [DEVICES.MOBILE]: '(max-width: 571px)',
};

export const getMediaByDevice = (device: DeviceType): string => MEDIA_BY_DEVICE[device];

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
    type: IMAGE_CONTENT_TYPES[SIZES_BY_IMAGE_FORMAT[device][options.format].extension ?? DEFAULT_EXTENSION_FOR_IMAGES],
  }));

// `isLcpCandidate` is reserved for the single cover that can be the largest
// contentful paint of the page (the article hero, the first card of a list).
// Every other cover stays lazy so a list of a dozen thumbnails does not compete
// with it for bandwidth.
export const getCover = (
  post: TransformedPostDataWithTransformedAuthors,
  format: ImageFormatType,
  { isLcpCandidate = false }: { isLcpCandidate?: boolean } = {}
): PictureProps => ({
  sources: getSources({ path: post.cover?.path, format, position: post?.cover?.position as ImagePositionType }),
  img: {
    src: getPathFile(
      getCoverPath({
        path: post.cover?.path,
        format,
        pixelRatio: 1,
        device: DEVICES.DESKTOP,
        position: post?.cover?.position as ImagePositionType,
      })
    ),
    alt: post.cover?.alt ?? post.title,
    width: SIZES_BY_IMAGE_FORMAT[DEVICES.DESKTOP][format].width,
    height: SIZES_BY_IMAGE_FORMAT[DEVICES.DESKTOP][format].height,
    loading: isLcpCandidate ? 'eager' : 'lazy',
    decoding: isLcpCandidate ? 'sync' : 'async',
    fetchPriority: isLcpCandidate ? 'high' : 'auto',
  },
});
