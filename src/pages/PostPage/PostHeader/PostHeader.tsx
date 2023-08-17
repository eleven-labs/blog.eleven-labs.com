import { AsProps, Box, Flex, Heading, Icon, Link } from '@eleven-labs/design-system';
import React from 'react';

export interface PostHeaderProps {
  title: React.ReactNode;
  date: string;
  readingTime: string;
  authors: {
    username: string;
    name: string;
    link: AsProps<'a'>;
  }[];
}

export const PostHeader: React.FC<PostHeaderProps> = ({ title, date, readingTime, authors }) => (
  <Box mt={{ xs: 's', md: 'xl' }} textSize="xs">
    <Heading as="h1" size="xl">
      {title}
    </Heading>
    <Flex flexDirection={{ xs: 'column', md: 'row' }} mt={{ md: 'xxs-3' }}>
      <Flex mt={{ xs: 'xxs', md: '0' }} color="dark-grey" alignItems="center">
        <Flex alignItems="center">
          <Icon name="calendar" size="24px" />
          <Box as="span" ml={{ xs: 'xxs-3' }}>
            {date}
          </Box>
        </Flex>
        <Flex alignItems="center" ml={{ xs: 's' }}>
          <Icon name="access-time" size="24px" />
          <Box as="span" ml={{ xs: 'xxs-3' }}>
            {readingTime}
          </Box>
        </Flex>
      </Flex>
      <Flex alignItems="center" mt={{ xs: 'xxs-2', md: '0' }} ml={{ md: 'xxs-3' }} color="dark-grey">
        <Icon name="person" size="24px" />
        {authors.map((author, index) => (
          <React.Fragment key={author.username}>
            <Link {...author.link} ml="xxs-3" data-internal-link="author">
              {author.name}
            </Link>
            {authors.length - 1 !== index && (
              <Box as="span" ml="xxs-3">
                &
              </Box>
            )}
          </React.Fragment>
        ))}
      </Flex>
    </Flex>
  </Box>
);
