#!/usr/bin/env node

import chalk from 'chalk';
import { exec } from 'node:child_process';
import { statSync } from 'node:fs';
import { resolve } from 'node:path';

import { fonts, subsets } from '../src/config/website/fonts';

// Define the directory for fonts
const fontsDir = resolve(process.cwd(), 'src/assets/fonts');
const fontsOutdir = resolve(process.cwd(), 'public/fonts');

const formatUnicode = (unicode: string): string => unicode.padStart(4, '0').toUpperCase();
const formatUnicodeFromNumber = (unicodeNumber: number, includePrefix: boolean = true): string => {
  const formattedUnicode = formatUnicode(unicodeNumber.toString(16));

  return includePrefix ? `U+${formattedUnicode}` : formattedUnicode;
};

const getUnicodeTableByUnicodeRange = (
  unicodeRangeString: string
): { range: string; codePoints: number[]; unicodes: string[]; characters: string[] }[] =>
  unicodeRangeString
    .replace(/U\+/g, '')
    .split(',')
    .reduce<{ range: string; codePoints: number[]; unicodes: string[]; characters: string[] }[]>(
      (unicodeTable, currentRange) => {
        if (currentRange.includes('-')) {
          const [start, end] = currentRange.split('-').map((i) => parseInt(i, 16));
          const codePoints: number[] = Array.from({ length: end - start + 1 }, (_, index) => start + index);

          return [
            ...unicodeTable,
            {
              range: currentRange,
              codePoints,
              unicodes: codePoints.map((codePoint) => formatUnicodeFromNumber(Number(codePoint))),
              characters: codePoints.map((codePoint) => String.fromCharCode(codePoint)),
            },
          ];
        }

        const codePoint: number = parseInt(currentRange, 16);

        return [
          ...unicodeTable,
          {
            range: currentRange,
            codePoints: [codePoint],
            unicodes: [currentRange],
            characters: [String.fromCharCode(codePoint)],
          },
        ];
      },
      []
    );

// Define supported font formats
const formats: string[] = ['woff2'];

// Function to get file size in kilobytes
const getFileSizeInBytes = (filePath: string): string => {
  const stats = statSync(filePath);

  return `${stats.size / 1000} kB`;
};

const optimizeFonts = (): void => {
  const unicodesInSubsets: string[] = [];
  for (const [subset, unicodeRange] of Object.entries(subsets)) {
    const unicodeTable = getUnicodeTableByUnicodeRange(unicodeRange);

    const unicodes = unicodeTable.reduce<string[]>(
      (currentUnicodes, item) => [...currentUnicodes, ...item.unicodes],
      []
    );
    unicodesInSubsets.push(...unicodes);
    console.log(
      `Here are the characters you selected in the \`${chalk.blue.bold(subset)}\` subset: ${unicodeTable
        .map((item) => item.characters.map((character) => `\`${chalk.yellow(character)}\``))
        .join(', ')}.\n`
    );
  }

  // Loop through each font configuration
  for (const { fontDirectoryName, styles } of fonts) {
    // Define source and optimized directories
    const sourcesDir = resolve(fontsDir, fontDirectoryName);

    // Loop through each font style
    for (const { fontFileName } of styles) {
      const sourceFontFileNameWithExtension = `${fontFileName}.ttf`;
      const sourceFontPath = resolve(sourcesDir, sourceFontFileNameWithExtension);
      const sourceFontFileSize = getFileSizeInBytes(sourceFontPath);

      for (const [subset, unicodeRange] of Object.entries(subsets)) {
        for (const format of formats) {
          const optimizedFontFileName = `${fontFileName}-${subset}.${format}`;
          const optimizedFontPath = resolve(fontsOutdir, optimizedFontFileName);

          const args = [
            sourceFontPath,
            `--output-file="${optimizedFontPath}"`,
            `--flavor=${format}`,
            '--layout-features="*"',
            `--unicodes="${unicodeRange}"`,
          ];
          exec(`pyftsubset ${args.join(' \\\n')}`, (error): void => {
            if (error) {
              console.error(`Error: ${error}`);

              return;
            }
            const optimizedFontFileSize = getFileSizeInBytes(optimizedFontPath);
            console.log(
              `Subsetting ${chalk.bold(sourceFontFileNameWithExtension)} to ${chalk.bold(
                optimizedFontFileName
              )} (was ${chalk.red(sourceFontFileSize)}, now ${chalk.green(optimizedFontFileSize)})`
            );
          });
        }
      }
    }
  }
};

optimizeFonts();
