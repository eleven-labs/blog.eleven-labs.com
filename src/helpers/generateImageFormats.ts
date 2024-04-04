import { readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, resolve } from 'node:path';
import Sharp, { FormatEnum } from 'sharp';

import { DeviceEnum, IMAGE_FORMATS } from '@/constants';
import { getPosts } from '@/helpers/markdownContentManagerHelper';

const resizeImage = async (options: {
  imagePathOrBuffer: string | Buffer;
  directoryPath: string;
  filename: string;
  width: number;
  height: number;
  extension: keyof FormatEnum;
}): Promise<void> => {
  const transformedImage = Sharp(options.imagePathOrBuffer, { failOn: 'none', animated: true })
    .resize({ width: options.width, height: options.height })
    .toFormat(options.extension);

  const transformedBuffer = await transformedImage.toBuffer();

  const imageDestPath = resolve(
    options.directoryPath,
    `${options.filename}-w${options.width}-h${options.height}.${options.extension}`
  );
  writeFileSync(imageDestPath, transformedBuffer);
};

export const generateImageFormats = async (): Promise<void> => {
  const posts = getPosts();

  const transformedBufferPromises: Promise<void>[] = [];

  const covers = posts.filter((post) => post.cover?.path).map((post) => post.cover?.path);
  covers.push('/imgs/default-cover.jpg');

  performance.mark('generate-image-formats-start');
  for (const cover of covers) {
    const imagePath = resolve(process.cwd(), 'public', cover!.slice(1) as string);
    const directoryPath = dirname(imagePath);
    const filename = basename(imagePath, extname(imagePath));
    const extension = 'avif';

    const originalImageBuffer = readFileSync(imagePath);

    for (const device of Object.values(DeviceEnum)) {
      for (const pixelRatio of [1, 2]) {
        for (const format of Object.values(IMAGE_FORMATS[device])) {
          const width = format.width * pixelRatio;
          const height = format.height * pixelRatio;
          transformedBufferPromises.push(
            resizeImage({
              imagePathOrBuffer: originalImageBuffer,
              filename,
              directoryPath,
              width,
              height,
              extension,
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
