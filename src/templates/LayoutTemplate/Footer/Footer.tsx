import './Footer.scss';

import {
  As,
  AsProps,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconNameType,
  Link,
  Logo,
  Text,
} from '@eleven-labs/design-system';
import React from 'react';

export interface FooterProps {
  introBlock: {
    title: React.ReactNode;
    description: React.ReactNode;
  };
  elevenLabsSiteLink: { label: React.ReactNode } & AsProps<'a'>;
  contact: {
    title: React.ReactNode;
    list: { title: React.ReactNode; description: React.ReactNode }[];
  };
  socialLinks: ({
    as?: As;
    iconName: Extract<IconNameType, 'rss' | 'facebook' | 'twitter' | 'linkedin' | 'welcometothejungle'>;
  } & Pick<React.ComponentProps<'a'>, 'href'>)[];
  languageLinks: ({
    label: React.ReactNode;
    isActive?: boolean;
  } & AsProps<'a'>)[];
}

export const Footer: React.FC<FooterProps> = ({
  introBlock,
  elevenLabsSiteLink: { label: elevenLabsSiteLinkLabel, ...elevenLabsSiteLinkProps },
  contact,
  socialLinks,
  languageLinks,
}) => (
  <Box as="footer" bg="navy" color="white" textAlign={{ xs: 'center', md: 'left' }} textSize="s" className="footer">
    <Flex
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="center"
      alignItems="center"
      pt={{ md: 'xl' }}
      pb={{ md: 'xl' }}
      gap={{ md: 'xxl-3' }}
      mb="xl"
    >
      <Box mb="xl">
        <Flex justifyContent={{ xs: 'center', md: 'start' }} alignItems="center" pt={{ xs: 'l', md: '0' }} mb="xxs">
          <Logo name="website" size="2.5em" />
        </Flex>
        <Text>{introBlock.title}</Text>
        <Text fontWeight="bold" mb="s">
          {introBlock.description}
        </Text>
        <Button {...(elevenLabsSiteLinkProps as typeof Button)}>{elevenLabsSiteLinkLabel}</Button>
      </Box>
      <Box>
        <Heading size="l" mb="s">
          {contact.title}
        </Heading>
        <Flex flexDirection={{ xs: 'column', md: 'row' }} gap={{ md: 'xl' }}>
          {contact.list.map((currentContact, contactIndex) => (
            <Box key={contactIndex} mb={contact.list.length === contactIndex + 1 ? 'xs' : 'm'}>
              <Text fontWeight="bold" mb="xxs-2">
                {currentContact.title}
              </Text>
              {currentContact.description}
            </Box>
          ))}
        </Flex>
        <Flex gapY="s">
          {socialLinks.map(({ as: As = 'a', iconName, ...linkProps }, socialLinkIndex) => (
            <As key={socialLinkIndex} target="_blank" {...linkProps}>
              <Icon name={iconName} size="2.5em" color="white" mx="xxs-2" />
            </As>
          ))}
        </Flex>
      </Box>
    </Flex>
    <Flex py="s" justifyContent="center" alignItems="center" className="footer__language-links-container">
      <Box mr="xxs">
        <Icon name="language" />
      </Box>
      {languageLinks.map(({ label, isActive, ...linkProps }, index) => (
        <React.Fragment key={index}>
          {isActive ? <Text fontWeight="bold">{label}</Text> : <Link {...linkProps}>{label}</Link>}
          {languageLinks.length - 1 !== index && <Box mx="s" />}
        </React.Fragment>
      ))}
    </Flex>
  </Box>
);
