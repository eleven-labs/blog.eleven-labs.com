import type { BoxProps } from '@/design-system';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import classNames from 'classnames';
import React from 'react';

import { Divider, Box, Flex, Heading, Text } from '@/design-system';

import './SummaryCard.scss';

export const SummaryCardVariant = ['primary', 'secondary'] as const;
export type SummaryCardVariantType = (typeof SummaryCardVariant)[number];

export interface SummaryCardProps extends BoxProps {
  variant?: SummaryCardVariantType;
  title: string;
  sectionActive?: string;
  sections: ({ name: string; label: string } & ComponentPropsWithoutRef<'a'>)[];
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  variant = 'primary',
  title,
  sectionActive,
  sections,
  ...props
}) => (
  <Box bg="white" p="m" className={classNames('summary-card', { [`summary-card--${variant}`]: variant })} {...props}>
    <Heading size="m" color="primary">
      {title}
    </Heading>
    <Flex flexDirection="column" mt="m">
      {sections.map(({ name, label, ...link }, index) => (
        <React.Fragment key={index}>
          <Flex
            as="a"
            gap="s"
            fontWeight="semi-bold"
            className={classNames('summary-card__section', {
              'summary-card__section--active': sectionActive === name,
            })}
            {...link}
          >
            <Text color={variant === 'primary' ? 'info' : undefined}>{variant === 'secondary' ? index + 1 : '•'}</Text>
            <Text>{label}</Text>
          </Flex>
          {index !== sections.length - 1 && <Divider my="xxs" />}
        </React.Fragment>
      ))}
    </Flex>
  </Box>
);
