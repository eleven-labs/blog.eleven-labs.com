import themeCss from '../styles/theme.css?raw';
import tokensCss from '../styles/tokens.css?raw';

/** Un token : nom, valeur claire, valeur sombre (bloc .dark du thème), commentaire d'usage. */
export interface Token {
  name: string;
  light: string;
  dark: string | null;
  note: string | null;
}

/** Déclarations « --nom: valeur; » suivies d'un commentaire facultatif, une par ligne comme dans les fichiers de tokens. */
function declarations(css: string): Map<string, { value: string; note: string | null }> {
  const found = new Map<string, { value: string; note: string | null }>();
  for (const line of css.split('\n')) {
    const text = line.trim();
    const colon = text.indexOf(':');
    const semicolon = text.indexOf(';', colon);
    if (!text.startsWith('--') || colon < 0 || semicolon < 0) continue;
    const rest = text.slice(semicolon + 1);
    const open = rest.indexOf('/*');
    const close = rest.indexOf('*/', open);
    found.set(text.slice(2, colon).trim(), {
      value: text.slice(colon + 1, semicolon).trim(),
      note: open >= 0 && close > open ? rest.slice(open + 2, close).trim() : null,
    });
  }
  return found;
}

const themeBlock = tokensCss.slice(tokensCss.indexOf('@theme'));
const darkStart = themeCss.indexOf('.dark {');
const darkBlock = darkStart < 0 ? '' : themeCss.slice(darkStart, themeCss.indexOf('}', darkStart));
const light = declarations(themeBlock);
const dark = declarations(darkBlock);

/** Tokens dont le nom commence par `prefix` (`color-`, `radius-`…), dans l'ordre du fichier de tokens. */
export function tokens(prefix: string): Token[] {
  return [...light.entries()]
    .filter(([name]) => name.startsWith(prefix))
    .map(([name, { value, note }]) => ({ name, light: value, dark: dark.get(name)?.value ?? null, note }));
}

/** Cellule des tableaux de tokens. */
export const tokenCell = 'border-b border-line px-3 py-2 align-top';
