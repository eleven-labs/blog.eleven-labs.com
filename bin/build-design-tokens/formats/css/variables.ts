import StyleDictionary from 'style-dictionary';

StyleDictionary.registerFormat({
  name: 'css/variables',
  formatter: ({ dictionary, file, options = {}  }) => {
    let output = '';
    if (options?.showFileHeader !== false) {
      output += StyleDictionary.formatHelpers.fileHeader({ file });
    }

    const variables = StyleDictionary.formatHelpers.formattedVariables({
      dictionary,
      outputReferences: options.outputReferences,
      format: 'css',
      formatting: {
        prefix: '--',
        indentation: '\t\t',
        separator: ':'
      }
    });

    if (options.mediaQuery) {
      output += `@use './abstracts' as *;\n\n`;
    }

    output += [
      `${options.selector ? options.selector : `:root`} {`,
      options.mediaQuery ? [
        `\t@include create-media-queries('${options.mediaQuery}') {`,
        variables,
        `\t}`,
      ].join('\n') : variables,
      '}'
    ].join('\n');

    return output;
  },
});
