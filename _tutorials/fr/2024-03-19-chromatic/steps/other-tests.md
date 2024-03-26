---
contentType: tutorial-step
tutorial: chromatic
slug: other-tests
title: Les autres tests qu'on peut lancer sur Chromatic
---

## Tests d'interactivité avec Play

Pour l’instant nous avons vu qu’avec Chromatic on pouvait lancer des tests de non régression visuelle. On peut également lancer des **tests d’interaction de composant !** On pourra tester si les comportements du composant lorsque l’utilisateur interagit avec correspond bien à ce qu’on souhaite.

Ces tests sont réalisés dans **l’onglet Interactions** des stories. Pour ajouter une interaction à une story il faut créer une fonction `play`. A l’intérieur on va pouvoir utiliser les utilitaires fournis par `@storybook/tests` qui regroupent **des utilitaires de Jest et de Testing-library**. On pourra utiliser `step` pour diviser les tests en sous parties nommées.

Chromatic n’est pas nécessaire pour lancer les tests d’interactivité. Il y a d’autres façons de lancer ces tests de façon automatique, notamment avec `@storybook/test-runner`. Je parle de ces tests ici car ils sont **automatiquement lancés dans Chromatic** avant qu'il prenne le snapshot, donc c’est d’une pierre deux coups.

Nous allons voir dans quels cas concret on peut utiliser des tests d'interactivité.

### Création de notre composant de test

Nous allons réaliser **une modale très basique**, un composant avec un `dialog` qui s'ouvre et se ferme.

Tout d'abord nous allons nous mettre sur une nouvelle branche, `feat/enable-interactions`.

```bash
git checkout main
git checkout -b feat/enable-interactions
```

Dans `src/stories`, créez un fichier `Modal.tsx`. Copiez et collez à l'intérieur de ce fichier le code suivant&nbsp;:

```tsx
import { useRef } from 'react';
import { Button } from './Button';

export const Modal = ({onOpenModal}: {onOpenModal: () => void}) => {
    const dialogElement = useRef<HTMLDialogElement>(null);
    const openModal = () => {
        dialogElement?.current?.showModal();
        onOpenModal();
    }
    const closeModal = () => dialogElement?.current?.close();

    return(
        <>
            <dialog ref={dialogElement}>
                <button type="button" aria-label="Fermer la modale" onClick={closeModal}>X</button>
                <p>Je suis une modale !</p>
            </dialog>
            <Button label="Ouvrir la modale" primary onClick={openModal} />
        </>
    )
}
```

Nous avons donc un `Button` qui nous permettra **d'ouvrir la modale** pour tester son comportement. Au click sur le bouton on appelle une méthode `showModal` qui apparient au `dialog` et qui permet comme son nom l'indique d'ouvrir la modale. Sur l'élément `dialog` nous avons récupéré **la référence de l'élément** avec `ref` pour utiliser ses méthodes. Cet élément contient un `button` avec **un `aria-label` explicite pour améliorer sa compréhension** pour les personnes utilisant un lecteur d'écran (puisque "X" n'est pas vraiment un super contenu de bouton, mais c'est pour l'exemple). Enfin on a un `p` qui affiche le contenu de la modale.

On va ensuite créer un fichier au même niveau, appelé `Modal.stories.ts` dans lequel on va ajouter ce code&nbsp;:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

import { Modal } from './Modal';

const meta = {
  title: 'Example/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {}
```

Relancez storybook s'il n'est pas déjà en train de tourner avec `npm run storybook`, vous devriez voir apparaître **une nouvelle story, "Modal"**.

### Prendre le snapshot d’un composant avec un état "ouvert"

Grâce aux interactions nous pouvons résoudre un des problèmes qu’on peut avoir avec Chromatic sur certains composants. Comment faire pour **prendre le snapshot d’un composant qui ne s’ouvre qu’au clic**, comme un dropdown ou une modale par exemple ? On peut utiliser une interaction pour activer le composant, car **Chromatic prend le snapshot après que les interactions ont réussi**. Si les interactions sont en erreur, alors le build est lui aussi en erreur.

Dans `Default` tout en bas de notre story nous allons ajouter **une fonction `play`**. Celle ci va nous permettre de lancer des interactions, visibles dans l'onglet du même nom dans la story `Default`.

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>
Si vous ne voyez pas l'onglet en question, appuyez sur le raccouris "q" pour afficher le panneau des addons dans la story. Il faut aussi bien être sur la story en elle-même et pas sur la documentation du composant.
</div>

```tsx
import { userEvent, within } from '@storybook/test'; // On importe ce dont on a besoin depuis @storybook/test

...

export const Default: Story = {
  play: async ({ canvasElement }) => { // On ajoute play
    const { getByRole } = within(canvasElement);

    const openButton = getByRole('button', { name: "Ouvrir la modale" });
    await userEvent.click(openButton);
  }
}
```

`canvasElement` contient le DOM de notre composant. `openButton` contient **l'élément qui a un rôle de bouton avec un nom accessible "Ouvrir la modale"**. On utilise `userEvent` pour cliquer sur le bouton. `getByRole` et `userEvent` viennent de `testing-library` qui est importé avec `@storybook/test`.

Dans l'onglet `Interactions` on a bien des lignes qui sont apparues pour décrire le code que nous venons d'ajouter. Aussi on remarque que **la modale s'ouvre toute seule !** Chromatic va donc pouvoir prendre en snapshot son contenu.

[Plus d'informations sur Testing Library ici](https://testing-library.com/)

### Tester l’accessibilité

Comment tester **des composants en prenant en compte des notions d’accessibilité** ?

Il y a tout d’abord un addon d'accessibilité, `storybook-addon-a11y`, qui permet d’afficher les erreurs et warnings possibles sur un composant. On peut aussi installer `axe-playwright` pour vérifier qu’il n’y a pas de régressions d’accessibilité.

On peut tester quelques points d'accessibilité **en utilisant les interactions appropriées**&nbsp;:

-   on peut **naviguer au clavier** dans notre composant grâce aux différentes méthodes de `userEvent`, pour vérifier que le composant répond bien aux différentes commandes au clavier, si **le focus est bien visible** et bien placé aux endroits appropriés au moment du snapshot,

-   on peut utiliser la query `byRole` de `testing-library`. Elle permet de **tester si le rôle de l’élément est le bon**, ce qui est utile pour les technologies d'assistance. On peut également vérifier que le nom accessible de l’élément est correct. On peut utiliser `logRoles` pour loguer dans la console la liste des rôles présents au moment du log sur le composant, ce qui est très pratique pour débugger.

-   Avec `byRole` on peut utiliser des options comme `name`, `description` et bien d’autres options pour vérifier l’accessibilité du composant.

-   Enfin on peut aussi utiliser les matchers de `jest-dom` pour compléter `testing-library` (comme `toHaveAccessibleName`, `toHaveFocus`...)

Le comportement souhaité d'une modale, **c'est que quand on l'ouvre, le focus passe directement sur l'élément permettant sa fermeture.** C'est donc ce que nous allons tester !

On va d'abord tester d'ajouter `logRoles` pour savoir quels éléments sont présents à l'ouverture de la modale.

```ts
import { logRoles, userEvent, within } from '@storybook/test';

export const Default: Story = {
  play: async ({ canvasElement }) => {

    ...

    logRoles(canvasElement);
  }
}
```

Dans la console du navigateur on peut voir que les éléments ont été loggés, et notamment celui ci&nbsp;:

```bash
button:

Name "Fermer la modale":
<button
  aria-label="Fermer la modale"
  type="button"
/>
```

C'est bien notre bouton de fermeture ! Et **son nom est comme indiqué dans le aria-label "Fermer la modale"** et non "X", son contenu. On peut donc retirer le `logRoles` et utiliser `getByRole` pour attraper ce bouton et vérifier qu'il est bien en état de focus lorsqu'on ouvre la modale.

```ts
import { expect, userEvent, within } from '@storybook/test';

export const Default: Story = {
  play: async ({ canvasElement }) => {

    ...

    const closeButton = getByRole('button', { name: "Fermer la modale" });
    expect(closeButton).toHaveFocus();
  }
}
```

**Les interactions sont vertes, le test passe bien !** On aura même une double vérification avec le snapshot de Chromatic qui va montrer l'état de focus par défaut du navigateur sur le bouton de fermeture.

[Voici le lien de documentation de `byRole`, avec toutes les options possibles](https://testing-library.com/docs/queries/byrole) et [la documentation de `jest-dom`](https://github.com/testing-library/jest-dom)

### Tester les événements

On peut tester les events émis par les composants **avec les actions de Storybook**. Les événements émis **s’affichent dans l’onglet Actions** mais sont bien utilisables dans la fonction `play`. On peut vérifier si **un événement a bien été émis lors d’une interaction, et avec quelle valeur**, s'il en a.

On voudrait vérifier que notre composant Modale émet bien un évènement **à l'ouverture de la modale**. On a déjà un `onOpenModal` dans notre composant, c'est lui que nous allons écouter. Dans les `argTypes` de `meta`, dans la story, nous allons ajouter cette configuration&nbsp;:

```ts
const meta = {
  title: 'Example/Modal',
  component: Modal,
  argTypes: { onOpenModal: { action: 'onOpenModal' } }, // <= nouvelle ligne ici
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;
```

Maintenant lorsque l'interaction se lance on a dans l'onglet `Actions` une entrée `onOpenModal` ! Il ne nous reste plus qu'à tester que **l'action est bien effectuée** dans notre fonction `play`&nbsp;:

```ts
export const Default: Story = {
  play: async ({ canvasElement, args }) => { // On ajoute `args` qui contient onOpenModal
    const { getByRole } = within(canvasElement);

    expect(args.onOpenModal).not.toHaveBeenCalled(); // On vérifie que onOpenModal n'a pas encore été appelée

    const openButton = getByRole('button', { name: "Ouvrir la modale" });
    await userEvent.click(openButton);

    const closeButton = getByRole('button', { name: "Fermer la modale" });
    expect(closeButton).toHaveFocus();

    expect(args.onOpenModal).toHaveBeenCalled(); // On vérifie que onOpenModal a été appelée
  },
};
```

Si tout s'est bien passé **les tests sont toujours verts !**

### Conditionner le lancement des interactions

Lorsqu’on ajoute une interaction, **elle est systématiquement jouée à l’ouverture** de la story. Ce n’est pas toujours le comportement souhaité. Il est possible de ne **lancer les interactions que pour Chromatic**, et également de masquer certains éléments à Chromatic pour le snapshot avec la fonction `isChromatic`. La fonction renverra `true` si on est sur Chromatic, sinon `false`. On peut l’utiliser directement dans les stories ou dans la fonction `Play`.

On veut que nos utilisateurs de Storybook puissent tester eux même l'ouverture de la modale avec le bouton. Nous allons donc **conditionner l'ouverture et les tests qui suivent** pour ne les lancer que sur Chromatic.

```ts
import isChromatic from "chromatic/isChromatic"; // On importe isChromatic

...

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    if (isChromatic()) { // On ajoute la condition autour de nos tests
      const { getByRole } = within(canvasElement);

      expect(args.onOpenModal).not.toHaveBeenCalled();

      const openButton = getByRole('button', { name: "Ouvrir la modale" });
      await userEvent.click(openButton);

      const closeButton = getByRole('button', { name: "Fermer la modale" });
      expect(closeButton).toHaveFocus();

      expect(args.onOpenModal).toHaveBeenCalled();
    }
  },
};
```

Et voilà ! Notre story est redevenue immobile. Il ne reste plus qu'à créer un commit et pousser nos modifications sur la CI&nbsp;:

```bash
git add .
git commit -m "feat: enable interactions on component Modal"
git push -u origin feat/enable-interactions
```

Sur le build de Chromatic on a bien **la modale ouverte avec notre bouton de fermeture entouré de noir**, c'est l'outline de focus par défaut de Chrome. C'est exactement ce qu'on voulait !
