import './ShareLinks.scss';

import { Flex, Icon, MarginSystemProps } from '@eleven-labs/design-system';
import React from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';

import { AVAILABLE_SHARE_LINKS } from '@/constants';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export type ShareLinkOptions = {
  urlToShare: string;
};

export type ShareLinksProps = MarginSystemProps & ShareLinkOptions;

export const ShareLinks: React.FC<ShareLinksProps> = ({ urlToShare, ...flexProps }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, copy] = useCopyToClipboard();
  const getShareLinkIcon = (linkName: string, index: number): JSX.Element | undefined => {
    switch (linkName) {
      case 'copyLink':
        return (
          <Icon
            key={index}
            name="link"
            size="26"
            color="black"
            className="share-links__copy-icon"
            onClick={(): Promise<boolean> => copy(urlToShare)}
            tabIndex={0}
            role="button"
          />
        );
      case 'twitter':
        return (
          <TwitterShareButton key={index} url={urlToShare}>
            <TwitterIcon size={26} />
          </TwitterShareButton>
        );
      case 'facebook':
        return (
          <FacebookShareButton key={index} url={urlToShare}>
            <FacebookIcon size={26} />
          </FacebookShareButton>
        );
      case 'linkedIn':
        return (
          <LinkedinShareButton key={index} url={urlToShare}>
            <LinkedinIcon size={26} />
          </LinkedinShareButton>
        );
      case 'reddit':
        return (
          <RedditShareButton key={index} url={urlToShare}>
            <RedditIcon size={26} />
          </RedditShareButton>
        );
      default:
        return;
    }
  };

  return (
    <Flex {...flexProps} justifyContent="end" my="m" gap="xs" className="share-links">
      {AVAILABLE_SHARE_LINKS.map((link, index) => link.isVisible && getShareLinkIcon(link.name, index))}
    </Flex>
  );
};
