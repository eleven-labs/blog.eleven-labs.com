import type { IconNameType } from '@/design-system/types';

import { kebabCase } from '@/design-system/helpers/stringHelper';

import * as Svgs from './svgs';

/** Noms des icônes, tirés des composants générés par svgr. */
export const iconNameList = Object.keys(Svgs).map((svgName) => kebabCase(svgName)) as IconNameType[];
