import { usePostPage } from '@/hooks/usePostPage';
import { ArticlePageProps } from '@/pages/ArticlePage';
import { ArticlePageData } from '@/types';

export const useArticlePageContainer = (article: ArticlePageData): ArticlePageProps => {
  const postPageProps = usePostPage(article);

  return {
    contentType: article.contentType,
    ...postPageProps,
    content: article.content,
  };
};
