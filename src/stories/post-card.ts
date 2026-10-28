import type { PostCardProps } from '@/components/post-card';

/** Contenu commun aux histoires, partagé avec celles de `PostCardList` et des pages. */
export const postCardArgs: PostCardProps = {
  contentType: 'article',
  cover: {
    img: {
      src: '/imgs/default-cover.jpg',
      alt: 'Illustration de l’article',
    },
  },
  title: 'Migrer son design system vers Tailwind CSS 4 : retour d’expérience sur un blog Astro',
  date: '9 févr. 2021',
  readingTime: { label: '24 min', dateTime: 'PT24M' },
  authors: [
    { username: 'mdupont', name: 'Marie Dupont' },
    { username: 'jmartin', name: 'Jean Martin' },
  ],
  excerpt:
    'Nous avons remplacé nos feuilles SCSS par des tokens et des classes sémantiques. Voici la méthode suivie, les pièges rencontrés et les gains obtenus sur la maintenance du blog.',
  link: {
    href: '#',
  },
};
