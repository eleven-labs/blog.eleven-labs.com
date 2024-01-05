import './SummaryBlock.scss';

import { Box, BoxProps, Flex, Heading, Text } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

import { Divider } from '@/components';

export interface SummaryBlockProps extends BoxProps {
  title: string;
  sectionActive?: string;
  sections: ({ name: string; label: string } & React.ComponentPropsWithoutRef<'a'>)[];
}

export const SummaryBlock: React.FC<SummaryBlockProps> = ({ title, sectionActive, sections, ...props }) => (
  <Box bg="white" p="m" className="summary-block" {...props}>
    <Heading size="l" fontWeight="bold" color="navy">
      {title}
    </Heading>
    <Flex flexDirection="column" mt="m">
      {sections.map(({ name, label, ...link }, index) => (
        <React.Fragment key={index}>
          <Flex
            as="a"
            gap="s"
            fontWeight="medium"
            className={classNames('summary-block__section', {
              'summary-card__section--active': sectionActive === name,
            })}
            {...link}
          >
            <Text>{index + 1}</Text>
            <Text>{label}</Text>
          </Flex>
          <Divider my="xxs" bg="light-grey" />
        </React.Fragment>
      ))}
    </Flex>
  </Box>
);
