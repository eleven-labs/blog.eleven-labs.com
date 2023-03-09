import { Headers, Request } from 'cross-fetch';
import express from 'express';

export const createFetchHeaders = (requestHeaders: express.Request['headers']): Headers => {
  const headers = new Headers();

  for (const [key, values] of Object.entries(requestHeaders)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  return headers;
};

export const createRequestByExpressRequest = (req: express.Request): Request => {
  const origin = `${req.protocol}://${req.get('host')}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  const url = new URL(req.originalUrl || req.url, origin);

  const controller = new AbortController();

  req.on('close', () => {
    controller.abort();
  });

  const init: RequestInit = {
    method: req.method,
    headers: createFetchHeaders(req.headers),
    signal: controller.signal,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body;
  }

  return new Request(url.href, init);
};

export const createRequestByUrl = (options: { url: string; origin?: string }): Request => {
  const controller = new AbortController();

  const init = {
    method: 'GET',
    headers: new Headers(),
    signal: controller.signal,
  };
  return new Request(new URL(options.url, options.origin || 'http://localhost').href, init);
};
