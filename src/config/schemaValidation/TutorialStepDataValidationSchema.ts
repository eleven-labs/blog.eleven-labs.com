import { z } from 'zod';

import { MARKDOWN_CONTENT_TYPES } from '@/constants';

export const TutorialStepDataValidationSchema = z.object({
  contentType: z.literal(MARKDOWN_CONTENT_TYPES.TUTORIAL_STEP),
  tutorial: z.string(),
  slug: z.string(),
  title: z.string(),
});
