import { z } from 'zod';

import {
  AuthorDataValidationSchema,
  PostDataSchemaValidation,
  TutorialDataSchemaValidation,
  TutorialStepDataValidationSchema,
} from '@/config/schemaValidation';
import { ContentTypeEnum } from '@/constants';

export interface ContentTypeData {
  contentType: ContentTypeEnum;
}

interface CommonPostData extends ContentTypeData, z.infer<typeof PostDataSchemaValidation> {}

export interface ArticleData extends CommonPostData {
  contentType: ContentTypeEnum.ARTICLE;
}

export interface TutorialData extends CommonPostData, z.infer<typeof TutorialDataSchemaValidation> {
  contentType: ContentTypeEnum.TUTORIAL;
}

export interface TutorialStepData extends ContentTypeData, z.infer<typeof TutorialStepDataValidationSchema> {
  contentType: ContentTypeEnum.TUTORIAL_STEP;
}

export interface AuthorData extends ContentTypeData, z.infer<typeof AuthorDataValidationSchema> {
  contentType: ContentTypeEnum.AUTHOR;
}

export type PostData = ArticleData | TutorialData;

export type ResultData = PostData | TutorialStepData | AuthorData;
