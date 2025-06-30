import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { HOST_URL, IS_ENV_PRODUCTION } from '@/constants';

export const getRobotsTxt = (): string => {
  return (
    IS_ENV_PRODUCTION
      ? ['User-agent: *', 'Allow: /', `Sitemap: ${HOST_URL}/sitemap.xml`]
      : ['User-agent: *', 'Disallow: /']
  ).join('\n');
};

export const generateRobotsTxt = async (options: { rootDir: string }): Promise<void> => {
  const robotsTxt = getRobotsTxt();
  writeFileSync(resolve(options.rootDir, 'robots.txt'), robotsTxt, 'utf8');
};
