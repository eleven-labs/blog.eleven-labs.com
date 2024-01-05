import './TutorialPage.scss';

import { Box, Button, Flex } from '@eleven-labs/design-system';
import React from 'react';

import { SummaryBlock, SummaryBlockProps } from '@/components';
import { ContentTypeEnum } from '@/constants';
import { PostPage, PostPageProps } from '@/pages';

export interface TutorialPageProps extends Omit<PostPageProps, 'children'> {
  contentType: ContentTypeEnum.TUTORIAL;
  progress: {
    title: string;
    steps: SummaryBlockProps['sections'];
    stepActive: SummaryBlockProps['sectionActive'];
  };
  content: string;
  previousLink?: { label: string } & React.ComponentPropsWithoutRef<'a'>;
  nextLink?: { label: string } & React.ComponentPropsWithoutRef<'a'>;
}

export const TutorialPage: React.FC<TutorialPageProps> = ({
  progress,
  content,
  previousLink: { label: previousLinkLabel, ...previousLink } = {},
  nextLink: { label: nextLinkLabel, ...nextLink } = {},
  ...postPage
}) => (
  <PostPage {...postPage} className="tutorial-page">
    <Box className="tutorial-page__content-container">
      <SummaryBlock title={progress.title} sections={progress.steps} sectionActive={progress.stepActive} />
      <Box as="section" textSize="s" dangerouslySetInnerHTML={{ __html: content }} />
    </Box>
    <Flex gap="l">
      {previousLinkLabel && previousLink && (
        <Button as="a" mt="l" variant="secondary" {...previousLink}>
          {previousLinkLabel}
        </Button>
      )}
      {nextLinkLabel && nextLink && (
        <Button as="a" mt="l" {...nextLink}>
          {nextLinkLabel}
        </Button>
      )}
    </Flex>
  </PostPage>
);
