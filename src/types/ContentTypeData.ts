import { z } from 'zod';

import {
  AuthorDataValidationSchema,
  PostDataSchemaValidation,
  TutorialDataSchemaValidation,
  TutorialStepDataValidationSchema,
} from '@/config/schemaValidation';
import { MARKDOWN_CONTENT_TYPES } from '@/constants';

export interface ContentTypeData {
  contentType: (typeof MARKDOWN_CONTENT_TYPES)[keyof typeof MARKDOWN_CONTENT_TYPES];
}

export interface CommonPostData extends z.infer<typeof PostDataSchemaValidation> {}

export interface ArticleData extends CommonPostData {
  contentType: 'article';
}

export interface TutorialData extends CommonPostData, z.infer<typeof TutorialDataSchemaValidation> {
  contentType: 'tutorial';
}

export interface TutorialStepData extends ContentTypeData, z.infer<typeof TutorialStepDataValidationSchema> {
  contentType: 'tutorial-step';
}

export interface AuthorData extends ContentTypeData, z.infer<typeof AuthorDataValidationSchema> {
  contentType: 'author';
}

export type PostData = ArticleData | TutorialData;

export type ResultData = PostData | TutorialStepData | AuthorData;
