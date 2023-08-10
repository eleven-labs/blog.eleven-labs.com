import './ShareLinks.scss';

import { Flex, Icon, MarginSystemProps, Text } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterShareButton,
} from 'react-share';

import { AVAILABLE_SHARE_LINKS } from '@/constants';
import { useCopyText } from '@/hooks/useCopyToClipboard';

export type ShareLinkOptions = {
  urlToShare: string;
};

export type ShareLinksProps = MarginSystemProps & ShareLinkOptions;

export const ShareLinks: React.FC<ShareLinksProps> = ({ urlToShare, ...flexProps }) => {
  const { t } = useTranslation();
  const [copy, copied] = useCopyText(urlToShare, 2000);

  const getShareLinkIcon = (linkName: string, index: number): JSX.Element | undefined => {
    switch (linkName) {
      case 'copyLink':
        return copied ? (
          <Text key={index} size="xs" fontWeight="medium">
            {t('pages.share_links.copied_label')}
          </Text>
        ) : (
          <Icon
            key={index}
            name="link"
            size="26"
            color="black"
            className="share-links__copy-icon"
            onClick={copy}
            tabIndex={0}
            role="button"
          />
        );
      case 'twitter':
        return (
          <TwitterShareButton key={index} url={urlToShare}>
            <Icon name="twitter" size={26} className="share-links__social-media-icon" />
          </TwitterShareButton>
        );
      case 'facebook':
        return (
          <FacebookShareButton key={index} url={urlToShare}>
            <Icon name="facebook" size={26} className="share-links__social-media-icon" />
          </FacebookShareButton>
        );
      case 'linkedIn':
        return (
          <LinkedinShareButton key={index} url={urlToShare}>
            <Icon name="linkedin" size={26} className="share-links__social-media-icon" />
          </LinkedinShareButton>
        );
      case 'reddit':
        return (
          <RedditShareButton key={index} url={urlToShare}>
            <RedditIcon size={26} className="share-links__social-media-icon" />
          </RedditShareButton>
        );
      default:
        return;
    }
  };

  return (
    <Flex {...flexProps} justifyContent="end" alignItems="center" my="m" gap="xs" className="share-links">
      {AVAILABLE_SHARE_LINKS.map((link, index) => link.isVisible && getShareLinkIcon(link.name, index))}
    </Flex>
  );
};
