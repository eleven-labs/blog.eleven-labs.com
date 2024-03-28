import { readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, resolve } from 'node:path';
import Sharp from 'sharp';

import { DeviceEnum, IMAGE_FORMATS } from '@/constants';
import { getPosts } from '@/helpers/markdownContentManagerHelper';

export const generateImageFormats = async (): Promise<void> => {
  const posts = getPosts();

  const covers = posts.filter((post) => post.cover).map((post) => post.cover?.path);
  covers.push('/imgs/default-cover.jpg');

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
          const transformedImage = Sharp(originalImageBuffer, { failOn: 'none', animated: true })
            .resize({ width, height })
            .toFormat(extension);

          const transformedBuffer = await transformedImage.toBuffer();

          const imageDestPath = resolve(directoryPath, `${filename}-w${width}-h${height}.${extension}`);
          writeFileSync(imageDestPath, transformedBuffer);
        }
      }
    }
  }
};
