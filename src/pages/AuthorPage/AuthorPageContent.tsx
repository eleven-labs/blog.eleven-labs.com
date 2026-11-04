import React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { Icon } from '@/design-system/ui/icon';
import { Link } from '@/design-system/ui/link';
import { Separator } from '@/design-system/ui/separator';
import { Text } from '@/design-system/ui/text';

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

// Avatar de la carte d'auteur, en grand
const avatarClassName = 'author-card-avatar author-card-avatar-lg';

export const AuthorPageContent: React.FC<AuthorPageContentProps> = ({ author, title, postCardList }) => (
  <>
    <div className="flex flex-col items-center justify-center text-center md:flex-row md:text-left">
      {author.avatarImageUrl ? (
        <img src={author.avatarImageUrl} alt={author.name} className={avatarClassName} />
      ) : (
        <div className={cn(avatarClassName, 'author-card-avatar-default')} aria-hidden="true" />
      )}
      <div className="mt-4 ml-4">
        <Text size="m" className="font-medium text-primary">
          {author.name}
        </Text>
        <div>{author.content}</div>
        {author.socialNetworks && (
          <div className="mt-4 flex flex-col items-center justify-center sm:flex-row md:justify-start">
            {author.socialNetworks.map((socialNetwork, index) => (
              <React.Fragment key={socialNetwork.name}>
                <Text>
                  <Icon name={socialNetwork.name} size="24px" className="rounded-control" />{' '}
                  <Link href={socialNetwork.url} target="_blank">
                    {socialNetwork.username}
                  </Link>
                </Text>
                {index !== (author.socialNetworks?.length ?? 0) - 1 && (
                  <Text render={<span />} className="mx-2">
                    •
                  </Text>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
    <Separator />
    <Text size="m" className="font-medium">
      {title}
    </Text>
    {postCardList}
  </>
);
