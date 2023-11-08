---
contentType: article
lang: fr
date: 2023-11-08
slug: rex-studio-integration-composants-react-avec-esi-sur-site-no-code
title: "Notre REX Studio : Intégration de composants React avec Varnish ESI pour un Site No Code"
excerpt: "Découvrez comment notre REX Studio a intégré avec succès des composants React et Varnish ESI sur un site No Code. Explorez les défis et solutions que nous avons mis en œuvre"
categories:
    - javascript
keywords:
    - react
    - no code
authors:
    - fpasquet
    - charles-eric
---

## Introduction

Notre studio REX, très précis, inclut un exemple concret de liste de produits e-commerce

## Nos Problématiques

- Un tout nouveau site web, géré par une équipe marketing non technique, permettant l'édition complète de leur contenu, de même que la personnalisation des pages et des modèles
- Besoin impératif d'intégrer des composants personnalisés connectés à un système e-commerce et à un CRM externe
- Facilité d'intégration de ces composants sur les pages éditoriales sans nécessiter de compétences en programmation (No Code)

## Notre Solutions

Dans cette section, nous allons plonger plus en profondeur dans les solutions que nous avons mises en place pour répondre aux problématiques mentionnées précédemment. Notre approche combine des outils CMS No Code, la création de composants React avec SSR + Rehydration, l'utilisation d'un Design System, et l'intégration des composants via ESI avec un reverse proxy devant notre CMS No Code. Laissez-nous vous expliquer en détail comment cela fonctionne.

### CMS No Code avec Webflow

Webflow est un CMS No Code puissant qui offre une interface conviviale pour la création et la gestion de sites web. C'est un choix judicieux pour les équipes marketing non techniques, car il permet une édition complète du contenu et la personnalisation des pages et des modèles sans nécessiter de compétences en programmation.

### Création de composants React avec SSR + Rehydration

Pour répondre à l'exigence d'intégrer des composants personnalisés connectés à un système e-commerce et à un CRM externe, nous avons opté pour la création de composants React avec Server-Side Rendering (SSR) et Rehydration. Cette approche nous permet d'allier la flexibilité de React à la performance du SSR.

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

Pour la stack technique, nous avons utilisé **Express**, **React** et **Vite** pour le SSR, mais vous pouvez utiliser Next.js, qui est simple à mettre en place.

### Utilisation d'un Design System pour une meilleure cohérence visuelle

La cohérence visuelle est essentielle pour une expérience utilisateur de haute qualité. Pour garantir cette cohérence, nous avons adopté un Design System. Ce système de conception centralisé définit des normes de conception, des composants réutilisables et des directives d'accessibilité. Ainsi, chaque composant que nous créons suit les mêmes directives de conception, ce qui garantit une expérience utilisateur homogène.

Pour en savoir plus sur l'importance des Design Systems, nous vous invitons à lire notre article : [Design System : Qu'est-ce que c'est et pourquoi en avez-vous besoin ?]({BASE_URL}/fr/pourquoi-creer-design-system/)

### Intégration des composants via ESI avec reverse proxy devant CMS no code

Pour intégrer nos composants React générés avec SSR dans notre CMS No Code, nous utilisons les ESI avec **Varnish**. Les ESI nous permettent d'inclure dynamiquement nos composants React sur les pages éditoriales sans impacter les performances.

Il ne vous reste plus qu'à ajouter une balise ESI à nos pages Webflow. Pour ce faire, nous avons ajouté un code d'intégration personnalisé sur Webflow.

Voici un exemple de la balise ESI que nous ajoutons dans le code HTML :

```html
<esi:include src="/components/product-list?category=smartphone" />
```

Le reverse proxy joue le rôle d'intermédiaire entre notre CMS No Code et nos composants React, garantissant une expérience utilisateur optimale. Cette approche permet aux équipes marketing de bénéficier pleinement des composants personnalisés sans avoir à se préoccuper des complexités techniques liées à l'intégration.
