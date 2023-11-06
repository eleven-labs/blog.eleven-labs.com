import { z } from 'zod';

import { CATEGORIES, ContentTypeEnum, LanguageEnum } from '@/constants';
import { intersection } from '@/helpers/objectHelper';

export const PostDataSchemaValidation = z.object({
  contentType: z.enum([ContentTypeEnum.ARTICLE, ContentTypeEnum.TUTORIAL]),
  lang: z.nativeEnum(LanguageEnum),
  date: z.coerce.date().transform((date) => date.toISOString().slice(0, 10)),
  slug: z.string().regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, 'Kebab case format not respected'),
  title: z.string(),
  excerpt: z.string(),
  cover: z.string().optional(),
  categories: z.array(z.enum(CATEGORIES)),
  authors: z.array(z.string()),
  keywords: z
    .array(z.string())
    .max(10, 'Too many items 😡.')
    .superRefine((val, ctx) => {
      if (intersection(val, CATEGORIES).length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must not include a category.',
        });
      }

      if (val.length !== new Set(val).size) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'No duplicates allowed.',
        });
      }
    })
    .optional(),
});

export const ArticleDataSchemaValidation = PostDataSchemaValidation.merge(
  z.object({
    contentType: z.literal(ContentTypeEnum.ARTICLE),
  })
);

export const TutorialDataSchemaValidation = PostDataSchemaValidation.merge(
  z.object({
    contentType: z.literal(ContentTypeEnum.TUTORIAL),
    steps: z.array(z.string()),
  })
);
