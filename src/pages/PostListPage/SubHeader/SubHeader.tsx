import './SubHeader.scss';

import { Box, Button, Flex, Heading } from '@eleven-labs/design-system';
import React from 'react';

export interface SubHeaderProps {
  introBlock: {
    title: React.ReactNode;
    description: React.ReactNode;
  };
  choiceCategoryLabel: React.ReactNode;
  choiceCategories: ({
    label: React.ReactNode;
    isActive?: boolean;
  } & React.ComponentPropsWithoutRef<'a'>)[];
}

export const SubHeader: React.FC<SubHeaderProps> = ({ introBlock, choiceCategoryLabel, choiceCategories }) => (
  <Box bg="azure" color="white" className="sub-header">
    <Flex
      flexDirection="column"
      pt={{ xs: 's' }}
      pb={{ xs: 'l' }}
      justifyContent={{ md: 'center' }}
      alignItems={{ md: 'center' }}
    >
      <Box>
        <Box px="m">
          <Heading as="p" size="m">
            {introBlock.title}
          </Heading>
          <Heading as="p" mt="xxs-3" size="xl" className="sub-header__description">
            {introBlock.description}
          </Heading>
          <Heading as="p" mt={{ xs: 's', md: 'l' }} size="m">
            {choiceCategoryLabel}
          </Heading>
        </Box>
        <Flex
          gap={{ xs: 'xs', md: 'xl' }}
          alignItems="center"
          mt={{ xs: 's', md: 'm' }}
          px="m"
          width="full"
          className="sub-header__choice-chip-group"
        >
          {choiceCategories.map(({ label, isActive, ...choiceCategoryProps }, index) => (
            <Button
              as="a"
              key={index}
              isChoiceChip={true}
              variant={isActive ? 'primary' : 'secondary'}
              {...choiceCategoryProps}
              data-internal-link="category"
            >
              {label}
            </Button>
          ))}
        </Flex>
      </Box>
    </Flex>
  </Box>
);
