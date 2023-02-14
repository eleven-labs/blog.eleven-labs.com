import { readFileSync } from 'node:fs';
import matter from 'gray-matter';
import { format } from 'date-fns';
import { authorDataValidationSchema, postDataValidationSchema } from './validationSchema';
import { getValidCategories } from './getValidCategories';

type AuthorType = {
    layout: 'author',
    login: string;
    title: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
    permalink: string;
}

type PostType = {
    layout: 'post',
    lang: string;
    date: string;
    slug: string;
    title: string;
    excerpt: string;
    cover?: string;
    authors: string[];
    categories?: string[];
    permalink: string;
}

const categories = [
    'javascript',
    'php',
    'agile',
    'architecture'
];

export const removeAllUndefinedValuesFromObject = <TData = Record<string, any>>(data: TData): TData =>
    Object.entries(data).reduce<TData>((currentData, [key, value]) => {
        if (value) {
            currentData[key as keyof TData] = value;
        }
        return currentData;
    }, {} as TData);

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

    const markdownContent = matter.stringify(
        matterResult.content,
        data,
    );

    return {
        markdownContent,
        data,
    };
};

export const markdownPostCleaning = async (
    filePath: string,
    authorsLogin: string[],
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
    const categoriesAndTags = [...new Set(
        [...(matterResult.data.categories || []), ...(matterResult.data.tags || []), ...(matterResult.data.oldCategoriesAndTags || [])]
        .map((keyword) => keyword?.toString()?.toLowerCase()?.trim())
    )];
    const excerpt = matterResult.data.excerpt || matterResult.content.split('\n').filter((str) => str.length > 0)[0];

    const { lang: validatedLang, date: validatedDate, ...validatedData } = await postDataValidationSchema({
        authorsLogin,
        categories,
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
        permalink: `/${lang}/${slug}/`
    }) as PostType;
    const markdownContent = matter.stringify(matterResult.content, data);

    return {
        markdownContent,
        data,
    };
};
