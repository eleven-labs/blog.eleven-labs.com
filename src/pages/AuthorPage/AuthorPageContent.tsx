import React from 'react';

import { Divider, Icon, Link, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

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

const avatarClassName = 'size-[120px] rounded-[100%]';

export const AuthorPageContent: React.FC<AuthorPageContentProps> = ({ author, title, postCardList }) => (
  <>
    <div className="flex flex-col items-center justify-center text-center md:flex-row md:text-left">
      {author.avatarImageUrl ? (
        <img src={author.avatarImageUrl} alt={author.name} className={avatarClassName} />
      ) : (
        <div className={cn(avatarClassName, 'bg-[url(/imgs/astronaut.png)] bg-cover bg-no-repeat')} />
      )}
      <div className="mt-s ml-s">
        <Text size="m" className="font-medium text-info">
          {author.name}
        </Text>
        <div>{author.content}</div>
        {author.socialNetworks && (
          <div className="mt-s flex flex-col items-center justify-center sm:flex-row md:justify-start">
            {author.socialNetworks.map((socialNetwork, index) => (
              <React.Fragment key={socialNetwork.name}>
                <Text>
                  <Icon name={socialNetwork.name} size="24px" className="rounded-[6px]" />{' '}
                  <Link href={socialNetwork.url} target="_blank">
                    {socialNetwork.username}
                  </Link>
                </Text>
                {index !== (author.socialNetworks?.length ?? 0) - 1 && (
                  <Text as="span" className="mx-xxs">
                    •
                  </Text>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
    <Divider />
    <Text size="m" className="font-medium">
      {title}
    </Text>
    {postCardList}
  </>
);
