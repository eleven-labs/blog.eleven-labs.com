# Design system : mémoire

Mémoire courte du skill `design-system` pour cette application : à lire en premier en reprise, à tenir à jour à la fin
de chaque étape, sous 120 lignes. Les conventions sont dans `docs/design-system.md`, pas ici.

## Emplacements

| Rôle | Chemin |
|---|---|
| Application | `.` |
| Feuille d'entrée | `src/styles.css` |
| Tokens | `src/design-system/styles/tokens.css` |
| Thème, classes | `src/design-system/styles/theme.css`, `src/design-system/styles/components.css` |
| Composants | `src/design-system/ui`, `src/components` |
| Documentation | `src/design-system` (Storybook) |
| Conventions | `docs/design-system.md` |

## Mode et état

- Mode : maintenir. Migré le 28/10/2026 depuis un design system maison (Atomic design, tokens nommés d'après la
  palette, Storybook 7), sur Base UI.
- Dernier audit (28/10/2026, fin de migration) : aucune erreur ni avertissement (`audit.mjs --strict`). Au départ :
  115 erreurs (couleurs en dur, palette, valeurs arbitraires) et 28 avertissements.

## Décisions

- 28/10 : primitives Base UI (déjà en dépendance, `useRender`), style `base-nova` de shadcn ; prop `render`, pas
  `asChild`.
- 28/10 : couleurs renommées d'après l'usage : `primary` = rose d'action (ex-`info`), `brand` = bleu (ex-`primary`),
  `footer`, `footer-strong`, `highlight` (jaune), `canvas`, `surface`, `surface-alt`, `line`, `line-strong`, `ink`,
  `ink-soft`, `muted` (absorbe #9b9b9b, 2,8:1). Encarts du markdown sur les couleurs d'état.
- 28/10 : échelles de Tailwind restreintes (`--spacing-*: initial`…), espaces nommés convertis (`p-m` → `p-6`,
  42 px → `10`), tailles de texte arrondies à l'échelle ; pas de token responsive : la taille bureau est dans les
  utilitaires `body-*`, `heading-*`, `markup-*` (`classes/typography.css`).
- 28/10 : `primary` assombri (#dd3156 → #c42848) : 3,95:1 sur canvas, sous le seuil AA, pour les liens et la page
  active. Coloration du code sur des tokens `code-*` (commentaires #969896 → #6a737d, balises, variables et littéraux
  assombris pour l'AA).
- 28/10 : métadonnées d'une carte posée sur le bleu en `highlight` (le rose y faisait 2,1:1) ; attributs `data-*` lus
  par les scripts (`data-header-menu`, `data-summary-*`, `data-tutorial-*`) gardés, pas lus par le CSS.
- 28/10 : `cn` déclare à tailwind-merge les noms propres au design system (utilitaires de texte, `control`, rayons,
  ombres) ; les noms de l'ancienne échelle sont retirés.
- 28/10 : accessibilité bloquante (`error`), sauf les histoires des blocs pas encore migrés (`a11y: { test: 'todo' }`
  dans leur meta, retiré à leur lot) ; lint en `warn` pendant la migration ; `react/no-multi-comp` désactivé
  (eslint-plugin-react 7 ne charge pas sous ESLint 10), un composant par fichier vérifié par l'audit.

## Migration

1. Socle et tokens : Storybook 10, vitest 5, Vite 6, tokens, thème, lint. **Fait.**
2. Composants de `src/design-system` → `src/design-system/ui/<composant>/` (kebab-case), classes sémantiques,
   équivalents de shadcn (Kbd, Skeleton, Separator, Breadcrumb, Pagination, Input), histoires `UI/<Catégorie>/…`.
   **Fait** : 20 composants, plus de baril `@/design-system` (imports par `@/design-system/ui/<composant>`).
3. Blocs de `src/components` (Atoms, Molecules, Organisms) → `src/components/<bloc>/`, histoires `Shared/…`.
   **Fait** : 19 blocs, classe générique `card` (`styles/classes/card.css`), plus de baril `@/components`.
4. Pages et mises en page (`src/pages`, `src/templates`), contenu rédigé (`PostContent.css`, `mdxComponents`).
   **Fait** : histoires `Pages/`, `Features/Post/`, `Layouts/` ; contenu stylé par classes (`tutorial-steps`, classe
   `js` sur `<html>`) ; `mdxComponents` découpé (un fichier par composant) ; `grid-cols-content-aside`, `max-h-sticky`.
5. Fin : accessibilité en `error`, lint en `error`, audit sans erreur. **Fait.**

## Versions

shadcn (CLI) 4.23.0, style base-nova ; @base-ui/react 1.8.0 ; Storybook 10.6.5 ; vitest 5.0.5 ; Vite 6.4.4 ;
Tailwind 4.3.3 ; eslint-plugin-better-tailwindcss 4.9.1 ; tw-animate-css 1.4.0.
