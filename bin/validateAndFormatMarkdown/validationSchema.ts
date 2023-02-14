import * as yup from 'yup';

export const authorDataValidationSchema = yup.object({
    login: yup.string().required(),
    title: yup.string().required(),
    twitter: yup.string().nullable(),
    github: yup.string().nullable(),
    linkedin: yup.string().nullable(),
});

export const postDataValidationSchema = (options: { authorsLogin: string[]; categories: string[] }) =>
    yup.object({
        lang: yup.string().required(),
        date: yup.date().required(),
        slug: yup.string().required(),
        title: yup.string().required(),
        excerpt: yup.string().required(),
        cover: yup.string().nullable(),
        authors: yup.array().of(
            yup.mixed().oneOf(options.authorsLogin).defined()
        ).required(),
        categories: yup.array().of(
            yup.mixed().oneOf(options.categories).defined()
        ),
    });
