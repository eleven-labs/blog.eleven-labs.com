const STYLE_EXTENSION_REGEX = /\.(css|scss|sass)(\?.*)?$/;
const ESM_ONLY_PACKAGE_REGEX = /\/react-syntax-highlighter\/dist\/esm\//;

/**
 * Les scripts de `bin/` chargent les composants du design system hors de Vite, avec le seul
 * résolveur de Node. Deux détails lui échappent :
 *
 * - les composants importent leurs propres feuilles de style, que Node ne sait pas charger ;
 *   elles sont remplacées par un module vide, le rendu React n'en a pas besoin ;
 * - `react-syntax-highlighter` publie de l'ESM dans `dist/esm` sans le déclarer dans son
 *   `package.json` : sans cette correction, son export par défaut arrive emballé deux fois.
 */
export const load = async (url, context, nextLoad) => {
  if (STYLE_EXTENSION_REGEX.test(url)) {
    return { format: 'module', shortCircuit: true, source: 'export default {};' };
  }

  if (ESM_ONLY_PACKAGE_REGEX.test(url)) {
    return nextLoad(url, { ...context, format: 'module' });
  }

  return nextLoad(url, context);
};
