import { z } from 'zod';
import { ContentTypeEnum } from '@/constants';

export const AuthorDataValidationSchema = z.object({
  contentType: z.literal(ContentTypeEnum.AUTHOR),
  username: z.string().regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, 'Kebab case format not respected'),
  name: z.string(),
  twitter: z
    .string()
    .superRefine((val, ctx) => {
      const pattern = /^https:\/\/twitter.com\/[a-z0-9_-]+\/?$/i;
      if (pattern.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'No need to define the complete url of twitter, just give the user name',
        });
      }
      if (val.startsWith('@')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'No need to set the "@" for twitter, just the username.',
        });
      }
    })
    .optional(),
  github: z
    .string()
    .superRefine((val, ctx) => {
      const pattern = /^https:\/\/github.com\/[a-z0-9_-]+\/?$/i;
      if (pattern.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'No need to define the complete url of github, just give the user name',
        });
      }
    })
    .optional(),
  linkedin: z
    .string()
    .superRefine((val, ctx) => {
      const pattern = /^https:\/\/www.linkedin.com\/in\/[a-z0-9_-]+\/?$/i;
      if (pattern.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'No need to define the complete url of linkedin, just give the user name',
        });
      }
    })
    .optional(),
});
