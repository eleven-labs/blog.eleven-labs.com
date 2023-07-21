import { Flex, MarginSystemProps } from '@eleven-labs/design-system';
import React from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';

export type ShareLinkOptions = {
  urlToShare: string;
  socialMedias: {
    name: 'copy' | 'linkedIn' | 'facebook' | 'twitter';
    isVisible: boolean;
  }[];
};

export type ShareLinksProps = MarginSystemProps & ShareLinkOptions;

export const ShareLinks: React.FC<ShareLinksProps> = ({ socialMedias, urlToShare, ...flexProps }) => {
  const getSocialMediaLink = (socialMedia: ShareLinkOptions['socialMedias'][0]['name']): JSX.Element | undefined => {
    switch (socialMedia) {
      case 'twitter':
        return (
          <TwitterShareButton url={urlToShare}>
            <TwitterIcon size={26} />
          </TwitterShareButton>
        );
      case 'facebook':
        return (
          <FacebookShareButton url={urlToShare}>
            <FacebookIcon size={26} />
          </FacebookShareButton>
        );
      case 'linkedIn':
        return (
          <LinkedinShareButton url={urlToShare}>
            <LinkedinIcon size={26} />
          </LinkedinShareButton>
        );
      default:
        return;
    }
  };

  return (
    <Flex {...flexProps} gap="s" className="share-links">
      {socialMedias.map((socialMedia) => socialMedia.isVisible && getSocialMediaLink(socialMedia.name))}
    </Flex>
  );
};
