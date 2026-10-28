// ESLint du design system : classes Tailwind v4 (ordre, classes inconnues, conflits, valeurs arbitraires) et
// conventions des composants (pas d'attribut data-slot / data-variant / data-size, un composant par fichier).
// Usage dans eslint.config.mjs : ...designSystem({ entryPoint: 'src/app/globals.css' })
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults';

const COLOR_UTILITIES =
  'bg|text|border|border-[trblxyse]|ring|ring-offset|fill|stroke|from|via|to|outline|divide|placeholder|decoration|shadow|accent|caret';
const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

/**
 * @param {object} options
 * @param {string} options.entryPoint feuille d'entrée de Tailwind (tokens, thème, classes sémantiques), relative au paquet
 * @param {boolean} [options.oneComponentPerFile] react/no-multi-comp ; demande le greffon react, déjà enregistré par
 *   eslint-config-next (sinon l'enregistrer avant)
 * @param {'error' | 'warn'} [options.level] 'warn' pendant une migration, 'error' ensuite
 * @param {string[]} [options.externalClasses] expressions des classes posées par du HTML qui n'appartient pas au
 *   design system (contenu markdown, formulaire d'un service tiers) : connues du lint sans être des classes Tailwind
 * @returns {import('eslint').Linter.Config[]}
 */
export function designSystem({ entryPoint, oneComponentPerFile = true, level = 'error', externalClasses = [] }) {
  return [
    {
      files: ['**/*.{ts,tsx,js,jsx}'],
      // Les tests comparent du HTML rendu (const LINK_CLASS = 'class="…"') : ce ne sont pas des listes de classes
      ignores: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
      plugins: { 'better-tailwindcss': betterTailwindcss },
      settings: {
        // detectComponentClasses : les classes sémantiques de @layer components sont des classes connues
        'better-tailwindcss': {
          entryPoint,
          detectComponentClasses: true,
          // Constantes de classes (MENU_BUTTON_CLASS_NAME, menuClassName…) lintées aussi : sinon elles cachent des valeurs arbitraires
          selectors: [
            ...getDefaultSelectors(),
            {
              kind: 'variable',
              name: '^[A-Z][A-Z0-9_]*_(CLASS|CLASSES|CLASS_NAME|CLASS_NAMES)$',
              match: [{ type: 'strings' }, { type: 'objectValues' }],
            },
            // Même chose en camelCase : const menuClassName = '…', avatarClasses = { … }
            {
              kind: 'variable',
              name: '^[a-z][A-Za-z0-9]*(Class|Classes|ClassName|ClassNames)$',
              match: [{ type: 'strings' }, { type: 'objectValues' }],
            },
          ],
        },
      },
      rules: {
        'better-tailwindcss/enforce-consistent-class-order': level,
        'better-tailwindcss/enforce-canonical-classes': level,
        'better-tailwindcss/enforce-shorthand-classes': level,
        'better-tailwindcss/no-conflicting-classes': level,
        'better-tailwindcss/no-deprecated-classes': level,
        'better-tailwindcss/no-duplicate-classes': level,
        'better-tailwindcss/no-unknown-classes': [level, { ignore: externalClasses }],
        'better-tailwindcss/no-unnecessary-whitespace': level,
        // Ni valeur ni variante arbitraire : l'échelle de Tailwind, un token, une classe sémantique ou un
        // @custom-variant à la place.
        'better-tailwindcss/no-restricted-classes': [
          level,
          {
            restrict: [
              {
                pattern: '^.*\\[.*$',
                message:
                  'Arbitrary value or variant "$0": use the Tailwind scale, a token, a semantic class or a @custom-variant.',
              },
              {
                // Couleurs de la palette de Tailwind (bg-gray-100, text-white) : les tokens à la place
                pattern: `^(.*:)?-?(${COLOR_UTILITIES})-((${PALETTE})-(50|[1-9]00|950)|black|white)(/\\d+)?$`,
                message: 'Tailwind palette colour "$0": use a token (bg-surface, text-muted, border-line).',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['**/*.{tsx,jsx}'],
      rules: {
        // Une variante est une classe de modificateur (btn-primary), un état un attribut ARIA ou une pseudo-classe
        'no-restricted-syntax': [
          level,
          {
            selector: 'JSXAttribute[name.name=/^data-(slot|variant|size)$/]',
            message: 'No data-slot / data-variant / data-size: use a modifier class (btn-primary) or an ARIA attribute.',
          },
        ],
      },
    },
    ...(oneComponentPerFile
      ? [
          {
            // Un composant par fichier, sous-composants de shadcn/ui compris ; les histoires composent sans définir.
            files: ['**/*.{tsx,jsx}'],
            ignores: ['**/*.stories.{tsx,jsx}'],
            rules: { 'react/no-multi-comp': [level, { ignoreStateless: false }] },
          },
        ]
      : []),
  ];
}
