import { readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { markdownAuthorCleaning, markdownPostCleaning } from './markdownCleaning';

const rootDir = process.cwd();

const validateAndFormatAuthors = async (): Promise<string[]> => {
  const authorDir = resolve(rootDir, '_authors');
  const authorFiles = readdirSync(authorDir);

  const authorsLogin: string[] = [];

  for (const fileName of authorFiles) {
    const filePath = resolve(authorDir, fileName);
    try {
      const { markdownContent, data } = await markdownAuthorCleaning(filePath);
      if (authorsLogin.includes(data.login)) {
        throw new Error('This login has already been taken by another author !');
      }

      writeFileSync(filePath, markdownContent, 'utf8');
      authorsLogin.push(data.login);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`[${filePath}] ${error.message}`);
      }
    }
  }

  return authorsLogin;
};

const validateAndFormatPosts = async (authorsLogin: string[]): Promise<void> => {
  const postByLangDir = resolve(rootDir, '_posts');
  const postByLangDirs = readdirSync(postByLangDir);

  const postPermalinks: string[] = [];

  for (const langDir of postByLangDirs) {
    const postDir = resolve(postByLangDir, langDir);
    const postFiles = readdirSync(postDir);
    for (const fileName of postFiles) {
      const filePath = resolve(postDir, fileName);
      try {
        const { markdownContent, data } = await markdownPostCleaning(filePath, authorsLogin);

        if (postPermalinks.includes(data.permalink)) {
          throw new Error(`This article already exists with the permalink '${data.permalink}' !`);
        }

        writeFileSync(filePath, markdownContent, 'utf8');
        postPermalinks.push(data.permalink);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`[${filePath}] ${error.message}`);
        }
      }
    }
  }
};

(async (): Promise<void> => {
  const authorsLogin = await validateAndFormatAuthors();
  await validateAndFormatPosts(authorsLogin);
})();
