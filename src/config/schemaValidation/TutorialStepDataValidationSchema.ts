import { z } from 'zod';

import { ContentTypeEnum } from '@/constants';

export const TutorialStepDataValidationSchema = z.object({
  contentType: z.literal(ContentTypeEnum.TUTORIAL_STEP),
  tutorial: z.string(),
  slug: z.string(),
  title: z.string(),
});
