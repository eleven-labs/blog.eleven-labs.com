import { globSync } from 'glob';
import { resolve } from 'node:path';

export const ROOT_DIR = process.cwd();
export const ASSETS_DIR = resolve(ROOT_DIR, '_assets');
export const POSTS_DIR = resolve(ROOT_DIR, '_posts');
export const AUTHORS_DIR = resolve(ROOT_DIR, '_authors');
export const MARKDOWN_FILE_PATHS = globSync([`${POSTS_DIR}/**/*.md`, `${AUTHORS_DIR}/**/*.md`]);
export const PUBLIC_DIR = resolve(ROOT_DIR, 'public');
export const IMGS_DIR = resolve(PUBLIC_DIR, 'imgs');
export const DATA_DIR = resolve(PUBLIC_DIR, 'data');
