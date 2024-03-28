import type { Request, Response } from 'express';
import mime from 'mime';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Sharp from 'sharp';

const contentTypesByFormat = {
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  png: 'image/png',
  avif: 'image/avif',
} as const;

type FormatEnum = keyof typeof contentTypesByFormat;

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
      format?: FormatEnum;
      quality?: number;
    } = {
      width: urlSearchParams.get('width') ? parseInt(urlSearchParams.get('width') as string) : undefined,
      height: urlSearchParams.get('height') ? parseInt(urlSearchParams.get('height') as string) : undefined,
      format: (urlSearchParams.get('format') as FormatEnum) ?? undefined,
      quality: urlSearchParams.get('quality') ? parseInt(urlSearchParams.get('quality') as string) : undefined,
    };

    if (params.format && !['jpeg', 'gif', 'webp', 'png', 'avif'].includes(params.format)) {
      throw new Error(`Unsupported format: ${params.format}`);
    }

    const originalImageBuffer = readFileSync(imagePath);
    let transformedImage = Sharp(originalImageBuffer, { failOn: 'none', animated: true });

    if (params.width && params.height) {
      transformedImage = transformedImage.resize({ width: params.width, height: params.height });
    }

    if (params.format) {
      const isLossy = ['jpeg', 'webp', 'avif'].includes(params.format);
      transformedImage = transformedImage.toFormat(
        params.format,
        params.quality && isLossy ? { quality: params.quality } : undefined
      );
    }

    const transformedBuffer = await transformedImage.toBuffer();
    const contentType = params.format
      ? (contentTypesByFormat[params.format] as string)
      : (mime.getType(imagePath) as string);

    // Send the response with the resized and converted image
    res.type(contentType).setHeader('Cache-Control', 'public, max-age=86400').send(transformedBuffer);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the image.' });
  }
};
