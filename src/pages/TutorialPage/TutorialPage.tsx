import './TutorialPage.scss';

import { Box, Button, Flex } from '@eleven-labs/design-system';
import React from 'react';

import { TutorialSteps, TutorialStepsProps } from '@/components/TutorialSteps';
import { ContentTypeEnum } from '@/constants';
import { PostPage, PostPageProps } from '@/pages';

export interface TutorialPageProps extends Omit<PostPageProps, 'children'> {
  contentType: ContentTypeEnum.TUTORIAL;
  steps: TutorialStepsProps['steps'];
  stepActive: TutorialStepsProps['stepActive'];
  content: string;
  previousLink?: { label: string } & React.ComponentPropsWithoutRef<'a'>;
  nextLink?: { label: string } & React.ComponentPropsWithoutRef<'a'>;
}

export const TutorialPage: React.FC<TutorialPageProps> = ({
  steps,
  stepActive,
  content,
  previousLink: { label: previousLinkLabel, ...previousLink } = {},
  nextLink: { label: nextLinkLabel, ...nextLink } = {},
  ...postPage
}) => (
  <PostPage {...postPage} className="tutorial-page">
    <Box className="tutorial-page__content-container">
      <TutorialSteps steps={steps} stepActive={stepActive} className="tutorial-page__steps" />
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
