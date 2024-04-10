import { basename, dirname, extname, resolve } from 'node:path';
import Sharp, { FormatEnum, OutputInfo } from 'sharp';

import { DEFAULT_EXTENSION_FOR_IMAGES, DEVICES, SIZES_BY_IMAGE_FORMAT } from '@/constants';
import { getPosts } from '@/helpers/markdownContentManagerHelper';
import { ImagePositionType } from '@/types';

const resizeImage = async (options: {
  imagePath: string;
  directoryPath: string;
  filename: string;
  width: number;
  height: number;
  pixelRatio: number;
  extension?: keyof FormatEnum;
  position?: ImagePositionType;
}): Promise<OutputInfo> => {
  const extension = options?.extension ?? DEFAULT_EXTENSION_FOR_IMAGES;
  const width = options.width * options.pixelRatio;
  const height = options.height * options.pixelRatio;
  const position = options?.position ?? 'center';
  const imageDestPath = resolve(
    options.directoryPath,
    `${options.filename}-w${options.width}-h${options.height}-x${options.pixelRatio}.${extension}`
  );

  const sharpImage = Sharp(options.imagePath, { failOn: 'none', animated: true });
  const metadata = await sharpImage.metadata();

  if (metadata?.width && metadata?.height && metadata.width < width && metadata.height < height) {
    console.info(
      `The image "${options.imagePath}" is too small, you need to enlarge it to be able to resize it (${options.width}x${options.height})`
    );
  }

  const transformedImage = sharpImage.resize({ width, height, position, withoutEnlargement: true }).toFormat(extension);
  return transformedImage.toFile(imageDestPath);
};

export const generateImageFormats = async (): Promise<void> => {
  const posts = getPosts();

  performance.mark('generate-image-formats-start');

  const transformedBufferPromises: Promise<OutputInfo>[] = [];
  const covers: { path: string; position?: ImagePositionType }[] = posts
    .filter((post) => post.cover?.path)
    .map((post) => ({
      path: post.cover!.path,
      position: post.cover?.position,
    }));
  covers.push({
    path: '/imgs/default-cover.jpg',
  });

  for (const { path, position } of covers) {
    const imagePath = resolve(process.cwd(), 'public', path!.slice(1) as string);
    const directoryPath = dirname(imagePath);
    const filename = basename(imagePath, extname(imagePath));

    for (const device of Object.values(DEVICES)) {
      for (const format of Object.values(SIZES_BY_IMAGE_FORMAT[device])) {
        for (const pixelRatio of [2, 1]) {
          transformedBufferPromises.push(
            resizeImage({
              imagePath,
              filename,
              directoryPath,
              width: format.width,
              height: format.height,
              pixelRatio,
              position,
            })
          );
        }
      }
    }
  }

  await Promise.all(transformedBufferPromises);
  performance.mark('generate-image-formats-end');
  const performanceMeasure = performance.measure(
    'generate-image-formats',
    'generate-image-formats-start',
    'generate-image-formats-end'
  );
  const durationInSeconds = performanceMeasure.duration / 1000;
  console.info(`The generation of image formats was done in ${durationInSeconds} seconds`);
};
