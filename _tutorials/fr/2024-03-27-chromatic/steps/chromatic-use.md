---
contentType: tutorial-step
tutorial: chromatic
slug: chromatic-use
title: Comment fonctionne Chromatic
---

## Comment fonctionne Chromatic ?

Chromatic fonctionne avec **un système de builds** qui vont se créer à chaque lancement du job dans la CI. Chromatic va vérifier s’il y a des différences visuelles par rapport au build précédent. **S’il n’y a pas de différence, le build passera** et le job sera vert. **S’il y a des différences par contre le build ne passera pas**, le job sera orange ou rouge et il faudra accepter ou non les régressions détectées par Chromatic.

Chromatic va prendre des snapshots, c’est à dire concrètement des **impressions d’écran** des stories. Pour déterminer s’il y a une différence, il va superposer le nouveau snapshot avec l’ancien et comparer, au pixel près, si quelque chose a changé. C’est le concept de test de non régression visuelle.

Ce sont **les snapshots qui constituent les crédits** de Chromatic. La version gratuite permet actuellement de prendre 5000 snapshots par mois, ce qui est suffisant pour nos besoins pour l’instant. Cependant nous verrons plus tard que la quantité de snapshots peut augmenter exponentiellement.

**Le snaposhot est pris après la fin des animations** que Chromatic va tenter d’arrêter à la dernière frame. Il se fera également après la fin des interactions de Storybook. Si pour une quelconque raison le snapshot se prend trop tôt il est possible de **rajouter un délai** fixe pour éviter les tests flaky&nbsp;:

```javascript
export const StoryName = {
	args: {
	with: "props",
},

parameters: {
	// Sets the delay (in milliseconds) for a specific story.
	chromatic: { delay: 300 },
};
```
([Plus d'informations sur le délais ici](https://www.chromatic.com/docs/delay/))

Nous allons donc **approuver le premier build de Chromatic** pour avoir une branche main qui sera saine et avec laquelle on pourra comparer les modifications d'autres branches.

Dans la pipeline du commit que nous venons de faire vous devriez retrouver l'icône de Chromatic et **un job nommé "UI Tests"**. Cliquez sur "Details" pour vous rendre directement sur **l'interface de Chromatic reliée à votre projet**, sur le build lié au commit.

![Le job "UI Tests" est vert dans la CI de Github]({BASE_URL}/imgs/tutorials/2024-03-27-chromatic/ui-tests.png)

Le build est vert&nbsp;: tous les nouveaux snapshots ont été acceptés par défaut ! Tout en bas de la page, dans la partie "Example", on peut retrouver les snapshots qui ont été pris des différents composants. Il y a également un bouton "View Storybook" à droite qui permet d'accéder à son Storybook publié.

## Modifions le rendu d'un composant

A partir de maintenant **nous allons faire des branches que nous mergerons** vers main pour reproduire un workflow standard de projet. Nous allons créer une branche qui va contenir une modification de style&nbsp;:

```bash
git checkout -b feat/button-primay-backgroundcolor
```

Nous allons effectuer une **petite modification de couleur** pour vérifier que Chromatic nous demande bien de valider la différence sur notre PR. Dans notre fichier de style `button.css` nous allons changer **la couleur primaire du bouton** par un bleu légèrement différent&nbsp;:

```css
.storybook-button--primary {
  color: white;
  background-color: #6495ed; /* Un bleu un peu différent ! */
}
```

### Avec quel autre build Chromatic va t’il comparer exactement ?

Chromatic va comparer les snapshots avec les snapshots du build d’un ou plusieurs ancêtres.

Le cas le plus simple et peut-être le plus courant est celui d’un commit **poussé sur une branche déjà existante** et qui possède déjà un build. Chromatic va comparer le build avant le nouveau commit avec les snapshots pris sur le job du nouveau commit.

Un autre cas&nbsp;: celui d’une nouvelle branche. Dans ce cas Chromatic va comparer le dernier build de la branche principale avec le snapshot de la nouvelle branche. C’est pourquoi il est **très important d’avoir son build de main à jour&nbsp;!**

Le build se lance en réalité 2 fois&nbsp;: une fois dans la PR au moment du push, puis une seconde fois au merge de la branche vers la branche principale. Dans tous les cas à ce moment là le build avec lequel on va comparer sera **celui de la branche principale**. C’est pourquoi il est très important de lancer un build sur main avec l'option `autoAcceptChanges` pour éviter de valider 2 fois les mêmes changements. A moins qu’il y ait des erreurs dans les interactions ou autres bugs farfelus, le build sera automatiquement validé comme étant la nouvelle base saine pour les nouvelles branches.

Pour plus d'information sur les gestion des ancêtres de Chromatic vous pouvez vous rendre sur la [documentation](https://www.chromatic.com/docs/branching-and-baselines/).

Nous allons configurer l'acceptation automatique des changements dans notre branche actuelle. Dans le fichier `chromatic.yml` nous allons ajouter en dessous du `ProjectToken` une nouvelle ligne qui configure `autoAcceptChanges`&nbsp;:

```yaml
with:
  projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
  autoAcceptChanges: "main" # Accepte automatiquement les modifications sur main
```

Créez un commit avec ces modifications et poussez votre branche&nbsp;:

```bash
git add .
git commit -m "feat: update button primary backgroundcolor and enable auto-accept on main"
git push -u origin feat/button-primay-backgroundcolor
```

Créez ensuite une pull request. Au bout de quelques secondes **vous retrouverez "UI Tests" dans les checks** de la PR.

![Le job "UI Tests" est orange dans la CI de Github]({BASE_URL}/imgs/tutorials/2024-03-27-chromatic/ui-tests3.png)

Le build est en orange&nbsp;: il n'est ni validé ni en erreur, il **attend simplement d'être review** comme indiqué dans la colone Status à côté de chacune de nos stories. Nous allons cliquer **sur le bouton bleu "Verify changes"** en haut à droite du tableau principal de la page pour pouvoir review chaque storie modifiée une par une.

![Le build de Chromatic est orange]({BASE_URL}/imgs/tutorials/2024-03-27-chromatic/ui-tests4.png)

Sur la nouvelle page nous avons tout en haut à gauche le nom de la première story et du composant&nbsp;: "Button: Primary". **En dessous nous pouvons trouver les snapshots.**. Nous avons à gauche l'état de base du composant, et **à droite le nouvel état** détecté par Chromatic... et notre bouton qui est vert fluo au lieu d'être bleu ! Pas de panique, **c'est la façon dont Chromatic indique les zones de différences** entre les deux snapshots. En haut à droite du snapshot du nouvel état se trouvent des boutons qui permettent d'indiquer différement les zones de différence en ajoutant une ombre ou un effet stromboscopique. **En cliquant sur "Diff" vous désactiverez l'overlay vert** pour afficher le composant.

Tout en bas de page nous retrouvons le DOM du composant qui est également affiché&nbsp;: il est important de noter que **Chromatic ne prend pas en compte les différences de DOM** pour déterminer si un composant a changé où non, c'est uniquement le snapshot visuel qu'il prend en compte. Le DOM est plutôt affiché à but informatif, pour aider à débugger par exemple, mais ne compte pas pour Chromatic. Enfin tout en haut à droite nous avons des flèches pour passer entre les différents composants, **puis deux boutons, "Deny" et "Accept"** à côté desquels sont accolés leurs versions "batch" pour tout refuser ou tout accepter.

On remarque que **le bleu du bouton est effectivement différent** et que Chromatic l'a bien repéré. On remarque aussi que modifier un seul composant a eu un impact sur des stories différentes, Header et Pages, que nous n'avons pas modifiées. C'est la force des tests de non régression visuelle&nbsp;: même si on ne sait pas quelles sont les impactes liées à nos modifications, **Chromatic est là pour vérifier sur chacunes des stories s'il y a des impactes auxquels on ne pense pas.** C'est un filet de sécurité très rassurant !

Un par un, **nous allons accepter les nouveaux snapshots de Chromatic**. Une fois tous les snapshots acceptés Chromatic nous renvoit sur la page précédente et nous pouvons voir que **le Build est devenu vert&nbsp;!** Youpi&nbsp;!

![La pipeline de la MR sur Github est passée au vert]({BASE_URL}/imgs/tutorials/2024-03-27-chromatic/ui-tests5.png)

De retour sur la PR vous verrez que **tous les checks sont passés** et que vous pouvez désormais la merger. Cliquez sur "Merge Pull Request" puis "Confirm Merge" et "Delete Branch" pour supprimer la branche devenue inutile. Rendez vous sur la liste des commits du projet et patientez quelques instants&nbsp;: **les jobs devraient tous passer au vert sans intervention** de votre part ! Si vous cliquez sur "Details" à côté de "Tests UI" vous verrez qu'un nouveau build a été lancé, depuis `main`, et que vous n'avez pas eu besoin de l'approuver pour qu'il soit vert.

![La pipeline de main sur Github est automatiquement passée au vert]({BASE_URL}/imgs/tutorials/2024-03-27-chromatic/ui-tests6.png)

[La documentation complète sur l'utilisation de Chromatic avec les Github Actions est ici](https://www.chromatic.com/docs/github-actions/).

### Turbosnap pour économiser des snapshots

Actuellement lorsque le job Chromatic se lance, toutes les stories existantes vont être passées à la moulinette **pour prendre un snapshot.** Comme expliqué précédemment, chaque snapshot consomme un crédit. Vous pouvez trouver le nombre de crédit consommé dans l'interface de Chromatic dans l'onglet "Manage".

Nous avons aussi vu qu’en réalité pour une PR **il y a deux builds qui sont lancés**&nbsp;: un premier au moment du push sur la branche, et un seconde au moment du merge de la branche sur la branche principale, que nous acceptons automatiquement. Existerait-il **un moyen d’économiser** un peu de snapshot ?

**Turbosnap** arrive à la rescousse ! Il s'agit d’une feature qui **va vérifier quels sont les fichiers potentiellement modifiés** par le commit afin de ne prendre que les snapshots qui peuvent être dans son scope. Ainsi si j’ai 10 stories sur Storybook mais que je n’en modifie qu’une, alors je n’aurais qu’un snapshot de consommé au lieu de 10 pour chaque build... ou presque. Chaque snapshot évité avec Turbosnap est considéré comme un cinquième d'un snapshot. **Pour 5 snapshots évité, on a donc consommé un crédit**.

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>
Petit instant bommer&nbsp;: avant, Turbosnap était complètement gratuit en crédit jusqu'à récemment&nbsp;: ce qui paraissait logique puisqu'il permettait de ne pas faire de snapshots, et donc d'économiser du temps et des ressources. C'était gagnant / gagnant ! Maintenant, même si le nouveau coût en crédit reste modéré, pour ma part la pillule a un peu de mal à passer...
</div>

![Une utilisation du meme "Pepperidge farm remembers" : "Do you remember when Turbosnap was free ? Pepperidge farm remembers"]({BASE_URL}/imgs/tutorials/2024-03-27-chromatic/turbosnap-pepperidge.jpg)

Turbosnap va remonter le plus possible dans les utilisations des fichiers modifiés pour déterminer **quelles stories peuvent être affectées**. On peut aussi passer des arguments pour reprendre des snapshots lorsque certains fichiers qui ne sont pas directement liés aux stories sont modifiés, comme les assets avec une option `externals` à ajouter à la configuration de l'Action Github.

On ne peut pas utiliser Turbosnap **avant d’avoir fait 10 builds validés.** Cela permet apparemment à Turbosnap de bien analyser le projet avant de commencer à exclure des stories.

Une fois que vous aurez 10 builds Chromatic validés sur le projet, vous pourrez ajouter `onlyChanged` à la configuration des Actions Github&nbsp;:

```yaml
jobs:
  chromatic:
    steps:
      # ...
      - name: Publish to Chromatic
        uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          autoAcceptChanges: "main"
          onlyChanged: true # Active Turbosnap
```

[La documentation complète sur Turbosnap est ici](https://www.chromatic.com/docs/setup-turbosnap/)

## Les modes (dark/light + viewport + variables globales)

Les snapshots pris par Chromatic ont par défaut **un viewport de 1200px** de large. Comment faire pour vérifier des rendus sur des viewports différents ? Est-ce qu’on pourrait prendre en compte d’autres éléments comme le darkmode ou la traduction ?

C’est effectivement possible **grâce aux modes de Chromatic**.

Nous allons ajouter une apparence en darkmode sur le bouton, et configurer la story du bouton pour que Chromatic prenne plusieurs snapshots&nbsp;: **en darkmode et lightmode, en 1200px et en 420px de large.**

Nous allons commencer par revenir sur `main` et pull nos modifications, puis créer une nouvelle branche `feat/enable-modes`&nbsp;:

```bash
git checkout main
git pull
git checkout -b feat/enable-modes
```

Pour ajouter une gestion basique des thèmes dans Storybook nous allons **installer l'addon `@storybook/addon-themes`**

```bash
npm i -D @storybook/addon-themes
```

On l'ajoute ensuite **à la suite des addons** déjà installés dans `.storybook/main.ts`&nbsp;:

```typescript
addons: ['@storybook/addon-themes'],
```

Relancez Storybook avec `npm run storybook`, vous verrez apparaître **un bouton qui permet de changer de thème dans la barre supérieure de l'interface**, tout à droite. Nous allons **modifier le CSS du bouton Primary** pour avoir un rendu différent si la classe `.dark` ajoutée par l'addon est présente. Dans le fichier `button.css` ajoutez les lignes suivantes&nbsp;:

```css
.dark .storybook-button--primary {
  color: black;
  background-color: #add8e6;
}
```

Si vous changez de thème vous pourrez maintenant **voir le bouton de la story Primary changer d'apparence**.

Nous allons maintenant créer les différents Modes utilisés par Chromatic, car pour l'instant les snapshots seraient toujours pris uniquement en version Light.

Nous allons créer un fichier `.storybook/modes.ts` dans lequel nous allons créer une variable `allModes`&nbsp;:

```typescript
export const allModes = {
  light: {
    theme: "light",
  },
  dark: {
    theme: "dark",
  },
};
```

On peut décider d'utiliser ces modes sur toutes les stories ou bien sur quelques stories en particulier. Nous allons utiliser cette dernière méthode pour **prendre les différents snapshots sur les stories du bouton**. Dans le fichier `Button.stories.ts` ajoutez ces lignes dans les `parameters` de l'objet `meta`&nbsp;:

```typescript
import { allModes } from './../../.storybook/modes';
// ...
const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    chromatic: { // On ajoute la configuration des modes ici
      modes: {
        light: allModes["light"],
        dark: allModes["dark"],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof Button>;
```

Nous allons aussi prendre **un snapshot du Header différents viewports**. Dans `.storybook/preview.ts` ajoutez ces lignes aux `parameters`&nbsp;:

```typescript
const preview = {
  parameters: {
    // ...
    viewport: {
      viewports: {
        sm: { name: "Small", styles: { width: "640px", height: "900px" } },
        md: { name: "Medium", styles: { width: "768px", height: "900px" } },
        lg: { name: "Large", styles: { width: "1024px", height: "900px" } },
      },
    },
  },
};
```

En cliquant sur le bouton des viewports du menu en haut de l'interace vous avez maintenant **trois choix&nbsp;: Small, Medium et Large**, qui correspondent aux noms que nous venons d'ajouter.

Dans `allModes` nous allons **ajouter des propriétés** qui référencent les viewports que nous venons d'ajouter. Voici à quoi ressemble `allModes` maintenant&nbsp;:

```typescript
export const allModes = {
  light: {
    theme: "light",
  },
  dark: {
    theme: "dark",
  },
  small: {
    viewport: "sm"
  },
  medium: {
    viewport: "md"
  },
  large: {
    viewport: "lg"
  }
};
```

Ensuite nous allons **ajouter la configuration** des modes dans la `Header.stories.ts`, dans `meta`&nbsp;:

```typescript
parameters: {
  // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
  layout: 'fullscreen',
  chromatic: {
    modes: {
      small: allModes["small"],
      medium: allModes["medium"],
      large: allModes["large"],
    },
  },
},
```

Et voilà ! Comme tout à l'heure on ajoute les modifications dans un commit, on pousse le tout, on crée la PR puis on va regarder ce que ça donne sur le build.

Pour le bouton **chaque story a deux nouveaux snapshots**&nbsp;: en effet on a un nouveau snapshot à valider **pour le mode dark, mais aussi pour le mode light !** On voit aussi que pour la story Warning on a modifié la couleur du texte du bouton. Pour les stories du Header nous avons maintenant **trois variations pour les trois viewports que nous avons ajoutés.**

Il aurait été également possible de croiser les thèmes et les viewports !

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>
Ajouter des modes de thème ou viewport consomme plus de snapshots&nbsp;: c'est exponentiel. Faites attention à bien cibler quels rendus sont important pour éviter de consommer trop de crédit.
</div>

<div class="admonition info" markdown="1"><p class="admonition-title">Info</p>
La navigateur par défaut de la version gratuite est Chrome, mais il est possible de tester différents navigateurs avec les versions payantes de Chromatic. Attention encore une fois, ajouter un nouveau navigateur revient à multiplier tous les snapshots déjà présents et donc là aussi à augmenter sa consommation de crédit.
</div>

[Voir la documentation complète sur les Modes](https://www.chromatic.com/docs/modes/)

Maintenant que nous avons modifié nos stories pour implémenter différents tests de non régression visuelle, nous allons pouvoir passer à la dernière partie de ce tuto, et parler des autres types de tests que nous pouvons faire sur Chromatic !
