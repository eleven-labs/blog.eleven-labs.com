import { format } from 'date-fns';
import matter from 'gray-matter';
import { readFileSync } from 'node:fs';

import { CATEGORIES } from '../../src/constants/categories';
import { AuthorType, PostType } from '../../src/types';
import { getValidCategories } from './getValidCategories';
import { authorDataValidationSchema, postDataValidationSchema } from './validationSchema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeAllUndefinedValuesFromObject = (data: any): any =>
  Object.entries(data).reduce((currentData, [key, value]) => {
    if (value) {
      currentData[key] = value;
    }
    return currentData;
  }, {} as any); // eslint-disable-line @typescript-eslint/no-explicit-any

export const markdownAuthorCleaning = async (
  filePath: string
): Promise<{
  data: AuthorType;
  markdownContent: string;
}> => {
  const matterResult = matter(readFileSync(filePath, 'utf8'));

  const validatedData = await authorDataValidationSchema.validate({
    login: matterResult.data.login,
    title: matterResult.data.title,
    github: matterResult.data.github,
    twitter: matterResult.data.twitter,
    linkedin: matterResult.data.linkedin,
  });

  const data = removeAllUndefinedValuesFromObject({
    layout: 'author',
    ...validatedData,
    permalink: `/authors/${validatedData.login}/`,
  }) as AuthorType;

  const markdownContent = matter.stringify(matterResult.content, data);

  return {
    markdownContent,
    data,
  };
};

export const markdownPostCleaning = async (
  filePath: string,
  authorsLogin: string[]
): Promise<{
  data: PostType;
  markdownContent: string;
}> => {
  const matterResult = matter(readFileSync(filePath, 'utf8'));

  const matchesLangAndDate = filePath.match(/(\w{2})\/(\d{4}-\d{2}-\d{1,2})/);
  const lang = matchesLangAndDate?.[1];
  const date = matchesLangAndDate?.[2];

  const matchesSlug = matterResult.data.permalink.match(/\/\w+\/([^/]+)\//);
  const slug = matchesSlug?.[1] || matterResult.data.permalink.replace(/\//gi, '');
  const categoriesAndTags = [
    ...new Set(
      [
        ...(matterResult.data.categories || []),
        ...(matterResult.data.tags || []),
        ...(matterResult.data.oldCategoriesAndTags || []),
      ].map((keyword) => keyword?.toString()?.toLowerCase()?.trim())
    ),
  ];
  const excerpt = matterResult.data.excerpt || matterResult.content.split('\n').filter((str) => str.length > 0)[0];

  const {
    lang: validatedLang,
    date: validatedDate,
    ...validatedData
  } = await postDataValidationSchema({
    authorsLogin,
    categories: CATEGORIES,
  }).validate({
    lang,
    date,
    slug,
    title: matterResult.data.title,
    excerpt,
    cover: matterResult.data.cover,
    authors: matterResult.data.authors,
    categories: getValidCategories(categoriesAndTags),
  });

  const data = removeAllUndefinedValuesFromObject({
    layout: 'post',
    lang: validatedLang,
    date: format(validatedDate, 'yyyy-MM-dd'),
    ...validatedData,
    oldCategoriesAndTags: categoriesAndTags,
    permalink: `/${lang}/${slug}/`,
  }) as PostType;
  const markdownContent = matter.stringify(matterResult.content, data);

  return {
    markdownContent,
    data,
  };
};
