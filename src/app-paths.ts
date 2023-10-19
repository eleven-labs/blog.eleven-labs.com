import { globSync } from 'glob';
import { resolve } from 'node:path';

export const ROOT_DIR = process.cwd();
export const ASSETS_DIR = resolve(ROOT_DIR, '_assets');
export const ARTICLES_DIR = resolve(ROOT_DIR, '_articles');
export const TUTORIALS_DIR = resolve(ROOT_DIR, '_tutorials');
export const AUTHORS_DIR = resolve(ROOT_DIR, '_authors');
export const MARKDOWN_FILE_PATHS = globSync([
  `${ARTICLES_DIR}/**/*.md`,
  `${AUTHORS_DIR}/**/*.md`,
  `${TUTORIALS_DIR}/**/*.md`,
]);
export const PUBLIC_DIR = resolve(ROOT_DIR, 'public');
export const IMGS_DIR = resolve(PUBLIC_DIR, 'imgs');
export const DATA_DIR = resolve(PUBLIC_DIR, 'data');
