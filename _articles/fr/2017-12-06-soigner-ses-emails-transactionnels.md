---
contentType: article
lang: fr
date: '2017-12-06'
slug: soigner-ses-emails-transactionnels
title: Soigner ses emails transactionnels
excerpt: >-
  L'année dernière un client nous a demandé que les e-mails envoyés par l'api
  soient plus esthétiques. N'ayant aucun intégrateur dans l'équipe, personne
  n'était motivé pour s'occuper de ce genre de ticket. Nous avons donc tiré au
  sort pour savoir qui s'en chargerait. Bien sûr, c'est tombé sur moi. Le but de
  la fonctionnalité était d'avoir des emails beaucoup plus soignés et
  responsives.
cover: /assets/2017-12-06-soigner-ses-emails-transactionnels/cover.png
categories: []
authors:
  - qneyrat
keywords:
  - html
  - front
  - mjml
---

L'année dernière un client nous a demandé que les e-mails envoyés par l'api soient plus esthétiques. N'ayant aucun intégrateur dans l'équipe, personne n'était motivé pour s'occuper de ce genre de ticket. Nous avons donc tiré au sort pour savoir qui s'en chargerait.

Bien sûr, c'est tombé sur moi (rip).

Le but de la fonctionnalité était d'avoir des emails beaucoup plus soignés et responsives...

> Ah!

Nos e-mails n'étaient pas particulièrement compliqués, mais le centrage du logo de l'entreprise et le design étaient problématiques.
J'ai donc commencé le ticket avec du HTML 3 et ses fabuleux tableaux, puis au bout de 5 minutes, je me suis dit qu'en 2017, devoir faire ça était vraiment stupide. J'ai donc cherché un moyen plus moderne de pouvoir intégrer ces e-mails.

## solution 1 : un builder drag and drop

La plupart des services d'e-mails proposent sur leur plateforme un builder avec drag and drop et un système de blocs.
Intéressant, mais je devais exporter chaque e-mail en HTML 3.

J'ai donc cherché une solution plus orientée développeur.
Étant donné que notre service d'e-mails était [Mailjet](https://fr.mailjet.com/).

Ils venaient tout juste de rendre open source un nouveau projet : [MJML](https://github.com/mjmlio/mjml).

## solution 2 : un générateur de HTML

MJML est une application CLI qui utilise des composants React pour générer du HTML 3 responsive.

Après quelques tests, j'ai choisi cette solution.

On écrit donc des balises du type `mj-*` qui vont ensuite permettre de générer du HTML 3. Voici un petit exemple :

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>

          <mj-image width="100" src="/assets/img/logo-small.png"></mj-image>

          <mj-divider border-color="#F45E43"></mj-divider>

          <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>

        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```

Vous pouvez essayer ce template ici : [https://mjml.io/try-it-live](https://mjml.io/try-it-live)

Beaucoup de composants sont disponibles notamment au niveau des colonnes, des tableaux, des listes, des images.
On retrouve dans l'exemple ci-dessus :
- les composants `mj-body`, `mj-container`, `mj-section`, `mj-column` qui vont permettre de gérer le placement des blocs de votre template.

- les composants `mj-button`, `mj-text`, `mj-divider`, `mj-table` qui eux vont permettre de gérer le contenu de votre template.

- les composants `mj-accordion`, `mj-carousel`, `mj-navbar`, `mj-invoice`, `mj-location` quant à eux, vont permettre de gérer des contenus plus complexes et exotiques comme une facture ou une localisation grâce à Google Maps.

Vous pouvez retrouver l'ensemble des composants sur la documentation de MJML : [https://mjml.io/documentation/#standard-body-components](https://mjml.io/documentation/#standard-body-components)

Le framework permet de gérer son style via le composant directement, comme par exemple :
```xml
<mj-image width="100" ...
```

ou directement dans les headers HTML via le composant `mj-style`.
```xml
...
<mj-head>
    <mj-style inline="inline">
    .link-nostyle {
        color: inherit;
        text-decoration: none
    }
    </mj-style>
</mj-head>
...
<mj-text>
    Hello <a href="https://mjml.io" class="link-nostyle">World</a>
</mj-text>
...
```

## Utilisation

MJML est disponible sous forme de CLI installable comme ceci :
```
npm install -g mjml
```

Maintenant que MJML est installé, on va créer un fichier `template.mjml`. Vous pouvez trouvez [ici des exemples de template](https://mjml.io/templates) déja tout prêts.

Pour générer un template de MJML vers HTML3 il suffit de lancer la commande :
```
mjml template.mjml --output my-email.html
```

## Intégration rapide dans Symfony

Une fois le template réalisé, j'ai remplacé les données par des variables `twig` et lors du déploiement, je génère des fichiers avec l'extension `twig` :
```
mjml /path/of/templates/template.mjml --output /path/of/ressources/my-email.html.twig
```

Grâce à cet outil, un développeur peut réussir sans trop de problèmes à proposer dans son application des emails transactionnels propres. En espérant ne plus voir en 2018 des emails composés uniquement d'un texte et non affichables sur son téléphone...
