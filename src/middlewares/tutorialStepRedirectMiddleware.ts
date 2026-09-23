import type { NextFunction, Request, Response } from 'express';

import { getPosts } from '@/helpers/markdownContentManagerHelper';
import { getTutorialStepRedirects } from '@/helpers/prerenderHelper/getUrls';

export const tutorialStepRedirectMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const path = req.path.endsWith('/') ? req.path : `${req.path}/`;
  const redirect = getTutorialStepRedirects(getPosts()).find(({ from }) => from === path);

  if (redirect) {
    return res.redirect(301, redirect.to);
  }

  next();
};
