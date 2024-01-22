import { useScript } from 'hoofd';
import React from 'react';
import { useLoaderData } from 'react-router-dom';

import { ContentTypeEnum } from '@/constants';
import { ArticlePageContainer } from '@/containers/ArticlePageContainer';
import { NotFoundPageContainer } from '@/containers/NotFoundPageContainer';
import { TutorialPageContainer } from '@/containers/TutorialPageContainer';
import { PostPageData } from '@/types';

export const PostPageContainer: React.FC = () => {
  const postPageData = useLoaderData() as PostPageData;
  useScript({
    type: 'module',
    text: [
      `import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';`,
      'mermaid.initialize({ startOnLoad: true });',
    ].join('\n'),
  });

  if (!postPageData) {
    return <NotFoundPageContainer />;
  }

  if (postPageData.contentType === ContentTypeEnum.TUTORIAL) {
    return <TutorialPageContainer tutorial={postPageData} />;
  }

  return <ArticlePageContainer article={postPageData} />;
};
