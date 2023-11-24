---
contentType: article
lang: fr
date: 2023-11-24
slug: rex-studio-integration-composants-react-avec-esi-dans-site-no-code
title: "Notre REX Studio : Intégration de composants React avec Varnish ESI dans un site No Code"
excerpt: "Découvrez comment notre Studio a intégré avec succès des composants React et Varnish ESI sur un site No Code. Explorez les défis et solutions que nous avons mis en œuvre"
categories:
    - javascript
keywords:
    - react
    - esi
    - varnish
    - webflow
    - no code
authors:
    - fpasquet
    - charles-eric
---

Voici un cas client concret sur lequel nous avons travaillé au sein du [Studio Eleven Labs](https://eleven-labs.com/conception-d-application) : la refonte d'une application web corporate et e-commerce pour répondre à de nouvelles problématiques.

Commencons par décrire cette application avant de détailler les nouvelles problématiques, puis de présenter nos solutions pour y répondre.


## Contexte de départ

### Fonctionnalités de l'application

Ce site inclut deux parties fonctionnellement différentes :
- Site vitrine sur lequel sont affichés des contenus éditoriaux : informations présentant l'entreprise, ainsi que ses produits.
- Plateforme e-commerce permettant d'acheter ces produits, et également donnant accès au compte de l'utilisateur connecté dans lequel il peut notamment suivre ses commandes.

Ces deux parties doivent être complètement intégrées pour que l'utilisateur puisse naviguer sans contrainte entre les différentes pages, surtout pour passer des pages de présentation des produits vers les parcours e-commerce lui permettant d'acheter ces mêmes produits.
Cela implique non seulement d'avoir des liens entre ces deux types de pages mais aussi d'avoir des composants e-commerce sur les pages éditoriales. Par exemple, sur une page éditoriale présentant une famille de produits, on souhaite avoir un composant e-commerce qui affiche les produits de cette famille, sous forme de caroussel, pour permettre l'ajout direct au panier.

![Contexte : Composants e-commerce intégrés sur le site vitrine]({BASE_URL}/imgs/articles/2023-11-24-rex-custom-components-react-varnish-esi/custom-components-context.png)

### Architecture existante

Jusqu'à présent, ce site, incluant ces deux parties différentes, était géré dans une seule application web React, constuite de manière complètement personnalisée, ce qui permettait d'intégrer comme nous le souhaitions ces contenus éditoriaux servis par un CMS headless et la plateforme e-commerce, comme représenté sur le schéma ci-dessous :

![Architecture existante avec CMS headless]({BASE_URL}/imgs/articles/2023-11-24-rex-custom-components-react-varnish-esi/custom-components-existing-headless-cms.png)

Mais cette approche mise en place par notre équipe il y a quelques années présentait d'autres problématiques que nous allons voir dans la partie suivante.

## Nos problématiques

### Plus de liberté pour les éditeurs de contenus

Pour ce client, l'ensemble des contenus corporate et produits du site sont rédigés par les équipes marketing qui n'ont aucune connaissance technique mais ont des envies de personnalisations bien particulières.

Dans le backoffice du CMS headless existant, ils ont la possibilité d'éditer des blocs de contenus (aussi appelés 'Slices' dans Prismic CMS) qui sont ensuite affichés sur le front au sein de templates prédéfinis. Ces templates ayant été définis il y a plusieurs années, ils ne répondent plus forcément aux nouveaux besoins et de manière générale ils limitent les éditeurs à leur simple utilisation : les éditeurs ne peuvent pas ajouter de nouveaux templates sans faire appel aux développeurs.

Ainsi ces éditeurs aimeraient pouvoir avoir complète liberté sur la création de templates de pages, avec la possibilité de glisser et déposer leur différents blocs de contenus où bon leur semble.

### Connexion à la plateforme e-commerce

Cette seconde problématique n'existait pas avec la solution existante puisqu'avec une seule application React, tout était parfaitement intégré au sein de la même application : contenus éditoriaux et e-commerce.
Mais à partir du moment où nous avons énoncé le défi précédent et que nous cherchons une solution pour donner plus de liberté aux éditeurs, il devient nécessaire de rappeler ce deuxième challenge qui reste important.

Laisser cette liberté d'édition de contenus à ces utilisateurs marketing non techniques n'est en effet pas suffisant.

Nous avons aussi impérativement besoin de faire en sorte que ce site de contenus soit au mieux intégré à la plateforme e-commerce, pour permettre aux visiteurs d'aller sur les parcours d'achat depuis les pages éditoriales de la façon la plus simple, sans changer d'univers et sans basculer sur une autre application.

Ainsi, il nous faut la possibilité d'intégrer des composants personnalisés au sein des contenus éditoriaux pour faire cette connexion avec la plateforme e-commerce.

Également il doit être possible d'ajouter ces composants personnalisés au sein des pages de contenu sans aucune compétence technique : glisser /déposer sur ces pages, comme pour les autres blocs de contenus.

Dans un souci de simplification pour cet article, nous ne parlerons que d'intégration à une plateforme e-commerce. Mais en réalité nous avions aussi besoin d'intégrer ce site avec d'autres applications externes, notamment un CRM.

## Notre solution

Dans cette section, nous allons plonger plus en profondeur dans les solutions que nous avons mises en place pour répondre aux problématiques mentionnées précédemment. Notre approche combine des outils CMS No Code, la création de composants React avec Server Side Rendering + Rehydration, l'utilisation d'un Design System, et l'intégration des composants via ESI avec un reverse proxy devant notre CMS No Code.

Voici déjà un aperçu général de la solution :

![Nouvelle solution avec CMS no code qui intègre des composants e-commerce]({BASE_URL}/imgs/articles/2023-11-24-rex-custom-components-react-varnish-esi/custom-components-new-no-code-cms.png)

Maintenant, laissez-nous vous expliquer en détails comment cela fonctionne.

### CMS No Code avec Webflow

Webflow est un CMS No Code puissant qui offre une interface conviviale pour la création et la gestion de sites web. C'est un choix judicieux pour les équipes marketing non techniques, car il permet une édition complète du contenu et la personnalisation des pages et des modèles sans nécessiter de compétences en programmation.

![CMS No Code Webflow]({BASE_URL}/imgs/articles/2023-11-24-rex-custom-components-react-varnish-esi/webflow-cms-no-code.png)

Nous avons d'abord sélectionné ce CMS pour son éditeur de page appelé "Designer" qui permet d'éditer les pages simplement en glissant et déposant les différents blocs graphiques ou textuels, tout en étant très avancé en termes de design : options de style avancées, transitions et animations par exemple.

Mais Webflow offre aussi ces avantages importants :
- Popularité, forte communauté, documentations complètes
- Optimisations natives pour le SEO et la web performance
- Gestion de contenus dans des collections CMS, que l'on peut afficher sur les pages No Code et qu'on peut aussi exposer via une API (comme avec un CMS headless)
- Workflows d'édition et publication
- Possibilité d'ajouter des blocs de code personnalisé HTML/CSS/JS

### Création de composants React avec SSR + Rehydration

Pour répondre à l'exigence d'intégrer des composants personnalisés connectés à un système e-commerce externe, nous avons opté pour la création de composants React avec Server-Side Rendering (SSR) et Rehydration. Cette approche nous permet d'allier la flexibilité de React à la performance du SSR.

Voici un exemple de notre composant React avec SSR et Rehydration qui affiche une liste de produits :

```tsx
import { Box, Button, Card, Flex, Heading, Product } from '@organisation/design-system';
import React from 'react';

import { useProductListQuery } from '@/graphql';

export const ProductListContainer: React.FC<{ category?: string }> = ({ category }) => {
  const productListResult = useProductListQuery({ variables: { category } });
  const addToBasket = (productId: string) => {};

  return (
    <Box>
      <Heading>Liste de Produits</Heading>
      <Flex direction="row" gap="40" justifyContent="center" wrap="wrap">
        {productListResult.data?.productList.map((product, index) => (
          <Card>
            <Product {...product} key={`product-${index}`} />
            <Button onClick={() => addToBasket(product.id)}>Ajouter au panier</Button>
          </Card>
        ))}
      </Flex>
    </Box>
  );
};
```

Pour la stack technique, nous avons utilisé **Express**, **React** et **Vite** pour le SSR, mais vous pourriez aussi utiliser Next.js, qui est simple à mettre en place.

### Utilisation d'un Design System pour une meilleure cohérence visuelle

La cohérence visuelle est essentielle pour une expérience utilisateur de haute qualité. Pour garantir cette cohérence, nous avons adopté un Design System. Ce système de conception centralisé définit des normes de conception, des composants réutilisables et des directives d'accessibilité. Ainsi, chaque composant que nous créons suit les mêmes directives de conception, ce qui garantit une expérience utilisateur homogène, que ces composants soient des composants personnalisés React ou des composants graphiques sur les pages du CMS No Code.

Pour en savoir plus sur l'importance des Design Systems, nous vous invitons à lire notre article : [Design System : Qu'est-ce que c'est et pourquoi en avez-vous besoin ?]({BASE_URL}/fr/pourquoi-creer-design-system/)

### Intégration des composants via ESI avec un reverse proxy devant le CMS No Code

Pour intégrer nos composants React générés avec SSR au sein des pages construites dans notre CMS No Code, nous utilisons les ESI avec **Varnish**. Les ESI nous permettent d'inclure dynamiquement nos composants React sur les pages éditoriales sans impacter les performances.

Il ne vous reste plus qu'à ajouter une balise ESI à nos pages Webflow. Pour ce faire, nous avons ajouté un code d'intégration personnalisé sur Webflow.

Voici un exemple de la balise ESI que nous ajoutons dans le code HTML :

```html
<esi:include src="/components/product-list?category=smartphone" />
```

Il faut passer par le "HTML Embed Code Editor" de webflow pour ajouter ce code au sein d'un bloc qui pourra ensuite être placé où on veut sur les pages Webflow :

![HTML Embed Code Editor dans Webflow]({BASE_URL}/imgs/articles/2023-11-24-rex-custom-components-react-varnish-esi/webflow-code-editor.png)

Pour rendre simple l'utilisation de ces blocs de codes personnalisés avec ces balises ESI pour les éditeurs de l'équipe marketing, nous avons pré-créé dans Webflow les différents blocs correspondants aux différents composants personnalisés, de façon à ce que les éditeurs n'aient ensuite qu'à les glisser/déposer où ils le souhaitent sur les pages.

Le reverse proxy joue le rôle d'intermédiaire entre notre CMS No Code et nos composants React, garantissant une expérience utilisateur optimale. Cette approche permet aux équipes marketing de bénéficier pleinement des composants personnalisés sans avoir à se préoccuper des complexités techniques liées à l'intégration.

## Conclusion

Ainsi cette solution permet à la fois de tirer partie d'un CMS no code laissant plus de liberté aux éditeurs de contenus pour construire leur page, tout en assurant une bonne intégration avec notre plateforme e-commerce pour optimiser les parcours d'achats !

Cette approche est aussi intéressante car on profite au maximum d'une solution CMS SaaS qui nous permet de nous concentrer exclusivement sur le développement des parties critiques liées au e-commerce plutôt que sur les simples pages de contenus. Ainsi l'implémentation de cette architecture présente un meilleur ROI global : c'est un aspect sur lequel nous sommes toujours attentifs pour nos projets Studio Eleven Labs !
