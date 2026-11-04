# Design system (.)

Conventions de l'interface : tokens, classes sémantiques, composants shadcn/ui sur Base UI, Storybook. Mémoire et
décisions du design system : `src/design-system/DESIGN-SYSTEM.md`. Contrôles du dépôt : le lint et les histoires (`test:stories`). L'audit
(`audit.mjs`) et le rangement des composants (`rehome.mjs`) sont des scripts du skill d'agent `design-system`, qui
n'est pas forcément installé dans le dépôt.

## Trois couches

1. **Tokens** : `src/design-system/styles/tokens.css`, source unique des couleurs, polices, tailles de texte, rayons, hauteurs et ombres (bloc
   `@theme` de Tailwind v4). Une valeur se change là, jamais dans un composant.
2. **Thème et classes** : `src/design-system/styles/theme.css` (variables de shadcn/ui pointées sur les tokens, mode sombre `.dark`,
   entrées nommées des mises en page, `@custom-variant`) et les classes sémantiques (`@layer components`) : le CSS
   d'un composant **à côté de lui** (`src/design-system/ui/button/button.css` près de `button.tsx`), les classes sans composant
   React dans `src/design-system/styles/classes/`, un fichier par famille (`overlay.css` pour les calques) ; `src/design-system/styles/components.css` les
   importe tous, et une nouvelle feuille s'y ajoute.
3. **Composants** : `src/design-system/ui` (shadcn/ui sur Base UI), dont les variantes CVA posent les classes sémantiques :
   `<Button variant="primary" size="sm">` rend `btn btn-primary btn-sm`.

## Classes sémantiques

- Un motif d'interface répété devient un **composant de `src/design-system/ui`** (ou de `src/components` s'il assemble plusieurs
  composants), pas une classe recopiée dans le JSX : `Button`, `Breadcrumb` (`BreadcrumbItem`, `BreadcrumbLink`),
  `Pagination`, `Reminder`… Avant
  d'écrire un bloc, chercher s'il existe déjà dans `src/design-system/ui`, puis dans le catalogue de shadcn/ui : un contrôle de
  formulaire (liste, zone de texte, case, bascule…) passe par son composant, ajouté s'il manque, même pour un seul usage.
- Un style répété (au moins deux fois, ou un motif du design system) devient une classe : `btn`, `btn-primary`,
  `btn-sm`, `card`, `link`, `kbd`, `input`, `reminder`, `pagination-link`, `breadcrumb-link`… Un
  ajustement ponctuel (marge, largeur, position) reste un utilitaire Tailwind dans le JSX.
- `@apply` pour les cas simples ; CSS standard pour les sélecteurs complexes et les états. `focus-ring` est un
  `@utility` pour pouvoir être appliqué par `@apply`.
- Couleurs uniquement par les tokens (`bg-surface`, `text-muted`) ou les variables de shadcn (`bg-background`) :
  jamais de valeur en dur, jamais la palette de Tailwind (`bg-gray-100`, `text-white`). Les couleurs d'état (succès,
  attente, échec, information) ne servent qu'aux états.
- **Aucune valeur arbitraire** de Tailwind (`w-[720px]`, `text-[13px]`, `grid-cols-[…]`, `rounded-[3px]`) ni
  variante arbitraire (`aria-[current=page]:`, `[&>svg]:`) : une taille vient des échelles des tokens (noms de
  Tailwind restreints aux pas retenus : `p-4`, `gap-2`, `text-sm`, listés sur la page Tokens de Storybook) ou d'une
  dimension nommée d'après son usage (`h-control`), une mise en page d'écran d'une entrée nommée du thème
  (`grid-cols-content-aside`, `max-h-sticky`), une variante d'un `@custom-variant` (`can-hover:`). Une classe
  hors de l'échelle (`p-5`) n'existe pas : un pas qui manque s'ajoute aux tokens. Dans une feuille de style, du CSS
  standard plutôt qu'un `@apply` à valeur arbitraire.
- Une taille ne change pas selon l'écran dans les tokens : la variation s'écrit dans le JSX (`md:`) ou dans la classe
  d'un composant.
- Une animation d'ouverture s'arrête sous `prefers-reduced-motion`, dans la feuille du composant animé.
- Attention : `muted` est, dans les tokens, la couleur du texte secondaire (`text-muted`) ; l'équivalent shadcn est
  `muted-foreground`. Ne pas redéfinir `--color-muted`, et écrire le fond secondaire `bg-surface-alt`, jamais
  `bg-muted` (qui prendrait la couleur du texte).
- Le lint vérifie les classes du JSX (`eslint-plugin-better-tailwindcss`, qui lit `src/styles.css`) : ordre canonique,
  classes inconnues (classes sémantiques comprises), en double ou en conflit, formes dépréciées, valeurs arbitraires.

## Pas d'attribut data-*

- Ni `data-slot`, ni `data-variant`, ni `data-size`. Une variante est une classe de modificateur (`btn-secondary`,
  `post-card-highlight-dark`, `summary-card-secondary`) ; un test cible un rôle ou un libellé accessible.
- Un état se lit dans les attributs d'accessibilité ou les pseudo-classes : `[aria-selected='true']`,
  `[aria-expanded='true']`, `[aria-invalid='true']`, `[aria-disabled='true']`, `:focus`, `:disabled`.
- Seuls `data-open` et `data-closed`, posés par Base UI, servent aux animations d'ouverture et de fermeture
  (avec `data-starting-style` et `data-ending-style` pour les transitions), et `data-side` pour leur direction.
  `data-placeholder` (Select) et `data-orientation` (Separator) sont les seuls autres attributs de Base UI lus,
  faute d'équivalent ARIA.

## Composants shadcn/ui

- Un dossier par composant, dans `src/design-system/ui` comme dans `src/components` : `<composant>.tsx`, son `.css`, son histoire,
  et un `index.ts` qui ré-exporte ses noms, pour que l'import reste `@/design-system/ui/<composant>`. Entre deux composants partagés,
  l'import passe par l'alias, jamais par un chemin relatif.
- Ajout par la CLI de shadcn (version épinglée, dans `.`), qui crée le fichier à plat. Il se range ensuite
  dans son dossier (un fichier par sous-composant, `index.ts`, feuille importée par `components.css`, attributs
  `data-*` retirés), et ses utilitaires deviennent des classes sémantiques : `rehome.mjs` du skill `design-system` le
  fait, sinon à la main sur le modèle d'un composant existant.
- Garder l'API de shadcn (noms des variantes, prop `render`, sous-composants) ; on peut ajouter des variantes (`success`,
  `warning`…), pas en retirer. Les textes visibles (« Close » des fenêtres) passent par les messages du projet.
- `cn` vient d'un seul endroit (`@/design-system/helpers/cn`) ; CVA reste pour les variantes typées.

## Storybook

- Chaque composant sans état (ui, bloc commun, mise en page, contenu) a son histoire `*.stories.tsx` à côté de lui,
  en CSF 3 typé (`satisfies Meta<typeof X>`), avec les textes et données du fil rouge du produit. Un composant
  connecté (qui lit des données ou un contexte) n'a pas d'histoire : sa version sans état en a une.
- **Le titre dit où est le fichier** : une section selon le rôle, puis les dossiers en anglais et en PascalCase, puis
  le composant. Six sections, dans cet ordre (`storySort`) :
  - `Design system/<Page>` : pages MDX de `src/design-system` ;
  - `UI/<Catégorie>/<Composant>` : `src/design-system/ui`, par catégorie (`Actions`, `Forms`, `Overlays`, `Navigation`,
    `Display`, `Feedback`) ;
  - `Shared/<Composant>` : `src/components` ;
  - `Layouts/<Nom>` pour les mises en page partagées, `Layouts/<Fonctionnalité>/<Nom>` pour celles d'une fonctionnalité ;
  - `Features/<Fonctionnalité>/<Groupe>/<Composant>` : contenus d'une fonctionnalité ;
  - `Pages/<Fonctionnalité>/<Écran>` : écrans complets, nommés sans le suffixe `Screen`.
- **Pages** : `<nom>-screen.stories.tsx`, à côté de l'écran, assemble sa mise en page et son contenu avec les données
  du fil rouge, sans rendre l'écran connecté. Une histoire par état de l'écran.
- Noms d'histoires en anglais, un état chacun : `Default`, `Empty`, `Loading`, `NotFound`, `Error`, `Mobile`, ou
  l'état métier. Un squelette n'a pas d'entrée à lui : c'est l'histoire `Loading` de ce qu'il remplace.
- Les données du fil rouge communes à plusieurs histoires et la coquille qui entoure une page sont dans
  `src/stories/`, que seules les histoires importent.
- L'onglet Docs est généré pour toutes les histoires (`autodocs`, une fois dans la configuration). Une histoire qui
  ouvre un calque d'emblée (fenêtre, panneau) s'y affiche dans son propre cadre (`docs.story.inline: false`).
- Les pages de `src/design-system` (introduction, tokens lus dans le fichier de tokens, classes) suivent toute nouvelle classe
  ou tout nouveau token, dans le même changement. Les exemples HTML des pages MDX sont dans `<Unstyled>`.
- Chaque histoire est rendue dans Chromium avec son contrôle d'accessibilité (axe), en local comme en CI : une
  histoire qui plante ou une violation fait échouer. Une violation se corrige dans le composant, jamais en
  désactivant la règle.

## Propre au blog

- **Typographie** : les tailles du texte courant, des titres et des intertitres du contenu rédigé sont des utilitaires
  de rôle (`body-s`, `heading-xl`, `markup-m`, dans `src/design-system/styles/classes/typography.css`), posés par
  `Text` et `Heading` et par `@apply` dans les feuilles du contenu. Chacun fixe sa taille mobile et sa taille à partir
  de `md`. Un nouvel utilitaire s'ajoute aussi à `cn` (`src/design-system/helpers/cn.ts`).
- **Contenu rédigé** : le HTML produit par le markdown est mis en forme par `src/pages/PostPage/PostContent.css`, hors
  couche, avec ses propres classes (`post-content`, `tutorial-steps`, `tweet-frame`), déclarées au lint par
  `externalClasses` dans `eslint.config.mjs`, comme celles du formulaire Webmecanik (`mauticform*`).
- **Attributs lus par les scripts** : `data-header-menu`, `data-header-search`, `data-summary-*`, `data-tutorial-steps`
  et `data-internal-link` servent aux scripts de la page (`src/helpers`), jamais au CSS.
- **Icônes** : générées par svgr dans `src/design-system/ui/icon/svgs` (`pnpm build:icons`), ignorées par le lint et
  l'audit ; les logos des réseaux gardent leurs couleurs de marque.
- **Histoires** : `Pages/<Écran>` pour `src/pages`, `Features/Post/<Bloc>` pour les parties d'une page d'article,
  `Layouts/<Nom>` pour `src/templates`.

