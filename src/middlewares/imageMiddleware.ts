import type { Request, Response } from 'express';
import mime from 'mime';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Sharp from 'sharp';

import { DEFAULT_EXTENSION_FOR_IMAGES, IMAGE_CONTENT_TYPES } from '@/constants';
import { ImageExtensionType, ImagePositionType } from '@/types';

export const imageMiddleware = async (req: Request, res: Response): Promise<unknown> => {
  try {
    const imagePath = resolve(process.cwd(), 'public', req.path.slice(1) as string);
    if (!existsSync(imagePath)) {
      return res.status(400).json({ error: 'The "path" parameter is required.' });
    }

    const decodedUri = decodeURIComponent(req.url);
    const [, searchParams] = decodedUri.split('?');
    const urlSearchParams = new URLSearchParams(searchParams);

    const params: {
      width?: number;
      height?: number;
      position: ImagePositionType;
      pixelRatio: number;
      extension: ImageExtensionType;
      quality?: number;
    } = {
      width: urlSearchParams.get('width') ? parseInt(urlSearchParams.get('width') as string) : undefined,
      height: urlSearchParams.get('height') ? parseInt(urlSearchParams.get('height') as string) : undefined,
      position: (urlSearchParams.get('position') ?? 'center') as ImagePositionType,
      pixelRatio: urlSearchParams.get('pixelRatio') ? parseInt(urlSearchParams.get('pixelRatio') as string) : 1,
      extension: (urlSearchParams.get('extension') as ImageExtensionType) ?? DEFAULT_EXTENSION_FOR_IMAGES,
      quality: urlSearchParams.get('quality') ? parseInt(urlSearchParams.get('quality') as string) : undefined,
    };

    if (params.extension && !['jpeg', 'gif', 'webp', 'png', 'avif'].includes(params.extension)) {
      throw new Error(`Unsupported extension: ${params.extension}`);
    }

    const originalImageBuffer = readFileSync(imagePath);
    let transformedImage = Sharp(originalImageBuffer, { failOn: 'none', animated: true });

    if (params.width && params.height) {
      const width = params.pixelRatio ? params.pixelRatio * params.width : params.width;
      const height = params.pixelRatio ? params.pixelRatio * params.height : params.height;
      transformedImage = transformedImage.resize({ width, height, position: params.position });
    }

    if (params.extension) {
      const isLossy = ['jpeg', 'webp', 'avif'].includes(params.extension);
      transformedImage = transformedImage.toFormat(
        params.extension,
        params.quality && isLossy ? { quality: params.quality } : undefined
      );
    }

    const transformedBuffer = await transformedImage.toBuffer();
    const contentType = params.extension
      ? (IMAGE_CONTENT_TYPES[params.extension] as string)
      : (mime.getType(imagePath) as string);

    // Send the response with the resized and converted image
    res.type(contentType).setHeader('Cache-Control', 'public, max-age=86400').send(transformedBuffer);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the image.' });
  }
};
