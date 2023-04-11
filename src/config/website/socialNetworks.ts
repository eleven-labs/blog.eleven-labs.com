import { IconNameType } from '@eleven-labs/design-system';

export const socialNetworks: {
  label: string;
  iconName: Extract<IconNameType, 'rss' | 'facebook' | 'twitter' | 'linkedin' | 'welcometothejungle'>;
  url: string;
}[] = [
  {
    label: 'RSS',
    iconName: 'rss',
    url: 'https://blog.eleven-labs.com/feed.xml',
  },
  {
    label: 'Facebook',
    iconName: 'facebook',
    url: 'https://www.facebook.com/11Labs',
  },
  {
    label: 'Twitter',
    iconName: 'twitter',
    url: 'https://www.twitter.com/eleven_labs/',
  },
  {
    label: 'LinkedIn',
    iconName: 'linkedin',
    url: 'https://linkedin.com/company/eleven-labs',
  },
  {
    label: 'Welcome to the Jungle',
    iconName: 'welcometothejungle',
    url: 'https://www.welcometothejungle.com/companies/eleven-labs',
  },
];
