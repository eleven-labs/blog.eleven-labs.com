import type { TransformedToken } from 'style-dictionary';
import type { FormatterArguments } from 'style-dictionary/types/Format';
import type { TransformedTokens } from 'style-dictionary/types/TransformedToken';

import StyleDictionary from 'style-dictionary';

import { getDefaultHeader } from '../../helpers';

const processJsonNode = (transformedTokens: TransformedTokens, depth: number): string => {
  let output = '';

  if (transformedTokens?.['value']) {
    const indent = '\t'.repeat(depth + 1);
    const transformedToken = transformedTokens as TransformedToken;
    const values = [
      `${indent}value: "${transformedToken.value}"`,
      ...Object.entries(transformedToken.original)
        .filter(([key]) => key !== 'value')
        .map(
          ([key, value]) =>
            `${indent}${key === 'comment' ? 'description' : key}: ${
              Array.isArray(value) ? `["${value.join('", "')}"]` : `"${value}"`
            }`
        ),
    ];
    output += '{\n';
    output += values.join(',\n');
    output += `\n${'\t'.repeat(depth)}}`;
  } else {
    output += '{\n';
    output += Object.keys(transformedTokens)
      .map((key) => {
        const newProp = transformedTokens[key];
        const indent = '\t'.repeat(depth + 1);
        if (key === 'comment' && typeof newProp === 'string') {
          return `${indent}description: '${newProp}'`;
        }
        return `${indent}'${key}': ${processJsonNode(newProp, depth + 1)}`;
      })
      .join(',\n');
    output += `\n${'\t'.repeat(depth)}}`;
  }

  return output;
};

export const typescriptObject = ({ dictionary }: FormatterArguments): string => {
  let output = getDefaultHeader();
  output += `export const tokenVariables = ${processJsonNode(dictionary.properties, 0)}`;
  return output;
};

StyleDictionary.registerFormat({
  name: 'typescript/object',
  formatter: typescriptObject,
});
