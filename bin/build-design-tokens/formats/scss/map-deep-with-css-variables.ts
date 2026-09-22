import type { Options } from 'style-dictionary';
import type { FormatterArguments } from 'style-dictionary/types/Format';
import type { TransformedToken, TransformedTokens } from 'style-dictionary/types/TransformedToken';

import StyleDictionary from 'style-dictionary';

import { getDefaultHeader } from '../../helpers';

const processJsonNode = (
  transformedTokens: TransformedTokens,
  depth: number,
  options: Options & { categoriesWithNotCssVariables?: string[]; injectVariables?: Record<string, string> }
): string => {
  let output = '';
  const indent = '\t'.repeat(depth + 1);

  if (Object.prototype.hasOwnProperty.call(transformedTokens, 'value')) {
    const transformedToken = transformedTokens as TransformedToken;
    output +=
      transformedToken?.attributes?.category &&
      options?.categoriesWithNotCssVariables?.includes(transformedToken.attributes.category)
        ? transformedToken.value
        : `var(--${transformedToken.name})`;
  } else {
    output += '(\n';

    if (depth === 0 && options?.injectVariables) {
      output += Object.entries(options?.injectVariables)
        .map(([key, value]) => `${indent}'${key}': "${value}"`)
        .join(',\n');
      output += ',\n';
    }

    output += Object.keys(transformedTokens)
      .filter((key) => !['comment'].includes(key))
      .map((key) => {
        const newProp = transformedTokens[key];
        return `${indent}'${key}': ${processJsonNode(newProp, depth + 1, options)}`;
      })
      .join(',\n');
    output += `\n${'\t'.repeat(depth)})`;
  }

  return output;
};

const scssMapDeepWithCssVariables = ({ dictionary, options }: FormatterArguments): string => {
  let output = getDefaultHeader();
  output += `$token-variables: ${processJsonNode(dictionary.properties, 0, options)}`;
  return output;
};

StyleDictionary.registerFormat({
  name: 'scss/map-deep-with-css-variables',
  formatter: scssMapDeepWithCssVariables,
});
