import { z } from 'zod';

import { CATEGORIES, IMAGE_POSITIONS, LANGUAGES, MARKDOWN_CONTENT_TYPES } from '@/constants';
import { intersection } from '@/helpers/objectHelper';

export const PostDataSchemaValidation = z.object({
  contentType: z.nativeEnum({
    ARTICLE: MARKDOWN_CONTENT_TYPES.ARTICLE,
    TUTORIAL: MARKDOWN_CONTENT_TYPES.TUTORIAL,
  } as const),
  lang: z.nativeEnum(LANGUAGES),
  date: z.coerce.date().transform((date) => date.toISOString().slice(0, 10)),
  slug: z.string().regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, 'Kebab case format not respected'),
  title: z.string(),
  excerpt: z.string(),
  oldCover: z.string().optional(),
  cover: z
    .object({
      path: z.string(),
      position: z.nativeEnum(IMAGE_POSITIONS).optional(),
      alt: z.string().optional(),
    })
    .optional(),
  categories: z.array(z.enum(CATEGORIES)).optional(),
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
  seo: z
    .object({
      title: z.string().max(62).optional(),
      description: z.string().max(155).optional(),
    })
    .optional(),
});

export const ArticleDataSchemaValidation = PostDataSchemaValidation.merge(
  z.object({
    contentType: z.literal(MARKDOWN_CONTENT_TYPES.ARTICLE),
  })
);

export const TutorialDataSchemaValidation = PostDataSchemaValidation.merge(
  z.object({
    contentType: z.literal(MARKDOWN_CONTENT_TYPES.TUTORIAL),
    steps: z.array(z.string()),
  })
);
