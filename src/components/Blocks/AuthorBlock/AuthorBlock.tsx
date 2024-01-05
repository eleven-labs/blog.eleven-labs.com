import './AuthorBlock.scss';

import { Box, Flex, FlexProps, Heading, Link, Text } from '@eleven-labs/design-system';
import React from 'react';

export interface AuthorBlockProps extends FlexProps {
  name: string;
  description: string;
  avatarImageUrl?: string;
  link: React.ComponentPropsWithoutRef<'a'>;
}

export const AuthorBlock: React.FC<AuthorBlockProps> = ({ name, avatarImageUrl, description, link, ...props }) => (
  <Flex {...props} alignItems="center" justifyContent="between" px="s" py="m" bg="white" className="author-block">
    <Flex gap="s" flex="1">
      <img src={avatarImageUrl ?? '/imgs/astronaut.png'} alt={name} className="author-block__avatar-img" />
      <Box>
        <Heading color="navy" size="s">
          {name}
        </Heading>
        <Text
          as="div"
          size="xs"
          mt="xxs-3"
          style={{ fontStyle: 'italic' }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </Box>
    </Flex>
    <Link
      {...link}
      px="m"
      fontWeight="medium"
      textTransform="uppercase"
      data-internal-link="author"
      className="author-block__link"
    >
      Voir le profil
    </Link>
  </Flex>
);
