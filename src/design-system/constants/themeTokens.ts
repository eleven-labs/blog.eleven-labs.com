import type { IconNameType } from '@/design-system/types';

import { Svgs } from '@/design-system/components/Atoms';
import { kebabCase } from '@/design-system/helpers/stringHelper';

/** Noms des icônes, tirés des composants générés par svgr. */
export const iconNameList = Object.keys(Svgs).map((svgName) => kebabCase(svgName)) as IconNameType[];
