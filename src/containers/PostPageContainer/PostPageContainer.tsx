import React from 'react';

import { ContentTypeEnum } from '@/constants';
import { NotFoundPageContainer } from '@/containers/NotFoundPageContainer';
import { ArticlePage } from '@/pages/ArticlePage';
import { TutorialPage } from '@/pages/TutorialPage';

import { usePostPageContainer } from './usePostPageContainer';

export const PostPageContainer: React.FC = () => {
  const postPageProps = usePostPageContainer();
  if (!postPageProps) {
    return <NotFoundPageContainer />;
  }
  const { post, ...pageProps } = postPageProps;

  if (post.contentType === ContentTypeEnum.TUTORIAL) {
    return (
      <TutorialPage
        contentType={post.contentType}
        steps={post.steps.map((step) => ({
          name: step.slug,
          label: step.title,
        }))}
        stepActive={post.steps![0].slug}
        content={post.steps![0].content}
        {...pageProps}
      />
    );
  }

  return <ArticlePage contentType={post.contentType} {...pageProps} content={post.content} />;
};
