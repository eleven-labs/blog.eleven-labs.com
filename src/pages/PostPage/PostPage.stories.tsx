import { Meta, StoryFn } from '@storybook/react';
import { LayoutTemplateDecorator } from '@storybook-decorators';
import React from 'react';

import { BackLink, BackLinkProps } from '@/components';
import BackLinkStories from '@/components/BackLink/BackLink.stories';
import NewsletterBlockStories from '@/components/NewsletterBlock/NewsletterBlock.stories';
import { ContentTypeEnum } from '@/constants';
import { PostPage } from '@/pages/PostPage/PostPage';

export default {
  title: 'Pages/Post',
  component: PostPage,
  args: {
    contentType: ContentTypeEnum.ARTICLE,
    backLink: React.createElement<BackLinkProps>(BackLink, BackLinkStories.args as BackLinkProps),
    header: {
      title: 'Refonte du blog',
      date: '08 fév. 2021',
      readingTime: 24,
      authors: [
        {
          username: 'jdoe',
          name: 'J. Doe',
          link: {
            href: '/fr/authors/jdoe',
          },
        },
        {
          username: 'jdupont',
          name: 'J. Dupont',
          link: {
            href: '/fr/authors/jdupont',
          },
        },
      ],
    },
    cover: {
      alt: 'hola',
      desktop:
        'https://s3-alpha-sig.figma.com/img/5f96/6072/313bfcef7d85e68b610f6bef0fdf3fa4?Expires=1699833600&Signature=jm1vahR7HtcrDz02Yt20JdC6ddPqoV17MlGqTUCgQR1xFbfRCTDhU5dgohD66pJEbOf1Mi3AycME3aoNeZjAPPS1s8oMGiFETr~EOT-xm6kprlLa1w-2HJ4afyNeB14ouuOUpVQRe5PWNwdA1cWji2vklEemtTJxzSLxt3Xu68OFWR1uaAQm3xAJaA0tjX3HxQbqrGM2CuGtVs10Ncr9Yqn3aP~9VP9bZufpmULl9XJ4hhptW9oAMdHNoZGSKdDEb0DHPnStcTahw7WTkZ-ycQ6cc5MLkptK73~6Cun7-eCH8mIIkloFlb74A4szRKBTq86u1fVN5gknvFTIKD4lwQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    },
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel diam vel ligula suscipit iaculis. Praesent sit amet interdum lacus. Donec feugiat, nibh sed viverra sollicitudin, leo eros scelerisque nisi, quis maximus justo purus at purus. Duis commodo lorem enim, vel venenatis risus tempor at. Nullam imperdiet ipsum mi, vitae suscipit lorem finibus non. Donec vitae lacinia arcu. Ut luctus, neque fermentum viverra ornare, nibh lacus vestibulum purus, a lacinia lorem felis sed erat. Integer porta eget urna et molestie. Morbi euismod nisl eu consequat porttitor. Duis suscipit, est in vulputate porttitor, nunc nunc pharetra urna, vitae congue urna purus et neque. Maecenas massa felis, venenatis quis mi nec, auctor blandit libero. Aliquam finibus sapien nisl.\n\nQuisque posuere risus quis tellus pharetra posuere. Aliquam risus lorem, elementum ac turpis non, tincidunt fringilla arcu. Suspendisse venenatis lacus in odio ullamcorper convallis. Phasellus vitae sapien diam. Nam sed quam molestie, vestibulum enim quis, aliquam nulla. Pellentesque ac imperdiet massa. Pellentesque eu suscipit ipsum. In nec neque nec sem placerat cursus at porttitor nibh. Quisque ac fermentum tellus, sed malesuada velit. Maecenas eu urna imperdiet neque semper volutpat id quis tortor. Etiam ac est dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas eget magna et nisi facilisis viverra et sed sem. Ut sit amet turpis in tortor ornare pretium. Ut interdum condimentum risus.\n\nNunc rutrum condimentum porttitor. Sed hendrerit quis nunc sit amet luctus. Ut ac arcu luctus elit dignissim efficitur. Duis vestibulum purus id diam facilisis, ut hendrerit metus pulvinar. Vivamus augue nibh, accumsan in tincidunt id, eleifend at dui. Donec vitae quam magna. Donec sed vulputate lectus. Praesent auctor risus dolor, eu ornare massa venenatis ut. Donec et justo a metus fringilla ultricies ut eu lorem. In vehicula nulla vitae sagittis convallis. Nullam a tortor vitae dolor tincidunt tempor ut eu massa.',
    footer: {
      title: 'écrit par',
      authors: [
        {
          name: 'John Doe',
          content: 'Astronaute John Doe @ ElevenLabs_\uD83D\uDE80',
          link: {
            href: '/fr/authors/jdoe',
          },
        },
        {
          name: 'Jeane Dupont',
          content: 'Astronaute Jeane Dupont @ ElevenLabs_\uD83D\uDE80',
          link: {
            href: '/fr/authors/jdupont',
          },
        },
      ],
      emptyAvatarImageUrl: '/imgs/astronaut.png',
    },
    newsletterBlock: NewsletterBlockStories.args,
    relatedPostList: {
      relatedPostListTitle: 'Articles sur le même thème',
      posts: Array.from({ length: 3 }).map((_, index) => ({
        slug: `titre-article-${index}`,
        title: `Titre de l'article ${index}`,
        date: '09 fév. 2021',
        readingTime: 24,
        authors: [{ username: 'jdoe', name: 'J. Doe' }],
        excerpt:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit vel tellus in molestie. Curabitur malesuada sodales consectetur. Aliquam convallis nec lacus in euismod. Vestibulum id eros vitae tellus sodales ultricies eget eu ipsum.',
      })),
    },
  },
  parameters: {
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [LayoutTemplateDecorator],
} as Meta<typeof PostPage>;

const Template: StoryFn<typeof PostPage> = (args) => <PostPage {...args} />;

export const Overview = Template.bind({});

export const PostPageWithTutorialContentType = Template.bind({});
PostPageWithTutorialContentType.args = {
  contentType: ContentTypeEnum.TUTORIAL,
};
