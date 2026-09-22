import React from 'react';

import { Box, Divider, Flex, Icon, Link, Text } from '@/design-system';

import './AuthorPage.scss';

export type SocialNetworkName = 'github' | 'twitter' | 'linkedin';

export type AuthorPageContentProps = {
  author: {
    username: string;
    name: string;
    avatarImageUrl?: string;
    content: React.ReactNode;
    socialNetworks?: {
      name: SocialNetworkName;
      url: string;
      username: string;
    }[];
  };
  title: React.ReactNode;
  postCardList: React.ReactNode;
};

export const AuthorPageContent: React.FC<AuthorPageContentProps> = ({ author, title, postCardList }) => (
  <>
    <Flex
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="center"
      alignItems="center"
      textAlign={{ xs: 'center', md: 'left' }}
    >
      {author.avatarImageUrl ? (
        <img src={author.avatarImageUrl} alt={author.name} className="author-page__avatar-img" />
      ) : (
        <div className="author-page__avatar-img author-page__avatar-img--empty" />
      )}
      <Box mt="s" ml="s">
        <Text size="m" fontWeight="medium" color="info">
          {author.name}
        </Text>
        <Box>{author.content}</Box>
        {author.socialNetworks && (
          <Flex
            flexDirection={{ xs: 'column', sm: 'row' }}
            mt="s"
            alignItems="center"
            justifyContent={{ xs: 'center', md: 'start' }}
            className="author-page__social_networks"
          >
            {author.socialNetworks.map((socialNetwork, index) => (
              <React.Fragment key={socialNetwork.name}>
                <Text>
                  <Icon name={socialNetwork.name} size="24px" />{' '}
                  <Link href={socialNetwork.url} target="_blank">
                    {socialNetwork.username}
                  </Link>
                </Text>
                {index !== (author.socialNetworks?.length ?? 0) - 1 && (
                  <Text as="span" mx="xxs">
                    •
                  </Text>
                )}
              </React.Fragment>
            ))}
          </Flex>
        )}
      </Box>
    </Flex>
    <Divider className="author-page__divider" />
    <Text size="m" fontWeight="medium">
      {title}
    </Text>
    {postCardList}
  </>
);
