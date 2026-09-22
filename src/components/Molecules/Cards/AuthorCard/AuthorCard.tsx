import type { FlexProps } from '@/design-system';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { Box, Flex, Link, Text } from '@/design-system';

import './AuthorCard.scss';

export interface AuthorCardProps extends FlexProps {
  name: string;
  description: React.ReactNode;
  avatarImageUrl?: string;
  link: { label: string } & ComponentPropsWithoutRef<'a'>;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({
  name,
  avatarImageUrl,
  description,
  link: { label: linkLabel, ...link },
  ...props
}) => (
  <Flex {...props} alignItems="center" gap="s" px="s" py="m" bg="white" className="author-card">
    {avatarImageUrl ? (
      <img src={avatarImageUrl} alt={name} className="author-card__avatar-img" />
    ) : (
      <div className="author-card__avatar-img author-card__avatar-img--empty" />
    )}
    <Flex
      flexDirection={{ xs: 'column', md: 'row' }}
      flex="1"
      justifyContent="between"
      alignItems={{ xs: 'start', md: 'center' }}
      gap="s"
    >
      <Box>
        <Text color="primary" size="m" fontWeight="semi-bold">
          {name}
        </Text>
        <Text as="div" size="xs" mt="xxs-3" italic>
          {description}
        </Text>
      </Box>
      <Link
        {...link}
        px={{ xs: '0', md: 'm' }}
        textTransform="uppercase"
        data-internal-link="author"
        className="author-card__link"
      >
        {linkLabel}
      </Link>
    </Flex>
  </Flex>
);
