import type { Request, Response } from 'express';

import { getDefaultLanguageHomeRedirect } from '@/helpers/prerenderHelper/getUrls';

// The home of the default language is served at the root, `/fr/` is permanently redirected to it
export const defaultLanguageHomeRedirectMiddleware = (_req: Request, res: Response): void =>
  res.redirect(301, getDefaultLanguageHomeRedirect().to);
