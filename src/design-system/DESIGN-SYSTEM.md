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

- Mode : migration d'un design system maison (Atomic design, tokens nommés d'après la palette, Storybook 7) vers les
  conventions du skill, sur Base UI.
- Dernier audit (28/10/2026, après le socle) : 107 erreurs (41 couleurs en dur dont 8 icônes de marque, 61 valeurs
  arbitraires, 2 hors de l'échelle, 2 `bg-muted`), 29 avertissements.

## Décisions

- 28/10 : primitives Base UI (déjà en dépendance, `useRender`), style `base-nova` de shadcn ; prop `render`, pas
  `asChild`.
- 28/10 : couleurs renommées d'après l'usage : `primary` = rose d'action (ex-`info`), `brand` = bleu (ex-`primary`),
  `footer`, `footer-strong`, `highlight` (jaune), `canvas`, `surface`, `surface-alt`, `line`, `line-strong`, `ink`,
  `ink-soft`, `muted` (absorbe #9b9b9b, 2,8:1). Encarts du markdown sur les couleurs d'état.
- 28/10 : échelles de Tailwind restreintes (`--spacing-*: initial`…), espaces nommés convertis (`p-m` → `p-6`,
  42 px → `10`), tailles de texte arrondies à l'échelle ; pas de token responsive : la taille bureau est dans les
  utilitaires `body-*`, `heading-*`, `markup-*` (`classes/typography.css`).
- 28/10 : accessibilité en `todo` et lint en `warn` pendant la migration ; `react/no-multi-comp` désactivé
  (eslint-plugin-react 7 ne charge pas sous ESLint 10), un composant par fichier vérifié par l'audit.

## Migration

1. Socle et tokens : Storybook 10, vitest 5, Vite 6, tokens, thème, lint. **Fait.**
2. Composants de `src/design-system` → `src/design-system/ui/<composant>/` (kebab-case), classes sémantiques,
   équivalents de shadcn (Kbd, Skeleton, Separator, Breadcrumb, Pagination), histoires `UI/<Catégorie>/…`.
3. Blocs de `src/components` (Atoms, Molecules, Organisms) → `src/components/<bloc>/`, histoires `Shared/…`.
4. Pages et mises en page (`src/pages`, `src/templates`), contenu rédigé (`PostContent.css`, `mdxComponents`).
5. Fin : accessibilité en `error`, lint en `error`, audit sans erreur.

## Versions

shadcn (CLI) 4.23.0, style base-nova ; @base-ui/react 1.8.0 ; Storybook 10.6.5 ; vitest 5.0.5 ; Vite 6.4.4 ;
Tailwind 4.3.3 ; eslint-plugin-better-tailwindcss 4.9.1 ; tw-animate-css 1.4.0.
