import type { Svgs } from '@/design-system/components/Atoms';

/**
 * Convertit un nom de composant SVG généré par svgr (`AccessTime`) en nom d'icône (`access-time`).
 */
type KebabCase<TValue extends string, TAccumulator extends string = ''> = TValue extends `${infer THead}${infer TTail}`
  ? THead extends Uppercase<THead>
    ? THead extends Lowercase<THead>
      ? KebabCase<TTail, `${TAccumulator}${THead}`>
      : KebabCase<TTail, `${TAccumulator}${TAccumulator extends '' ? '' : '-'}${Lowercase<THead>}`>
    : KebabCase<TTail, `${TAccumulator}${THead}`>
  : TAccumulator;

export type IconNameType = KebabCase<keyof typeof Svgs & string>;
