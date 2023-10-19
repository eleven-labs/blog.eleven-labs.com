import { Box } from '@eleven-labs/design-system';
import React from 'react';

import { ContentTypeEnum } from '@/constants';
import { PostPage, PostPageProps } from '@/pages';

export interface ArticlePageProps extends Omit<PostPageProps, 'children'> {
  contentType: ContentTypeEnum.ARTICLE;
  content: string;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ content, ...postPage }) => (
  <PostPage {...postPage}>
    <Box as="section" textSize="s" dangerouslySetInnerHTML={{ __html: content }} />
  </PostPage>
);
