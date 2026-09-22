import type { ColorSystemProps } from './ColorSystemProps';
import type { FlexItemSystemProps } from './FlexItemSystemProps';
import type { FlexOrGridItemSystemProps } from './FlexOrGridItemSystemProps';
import type { LayoutSystemProps } from './LayoutSystemProps';
import type { SpacingSystemProps } from './SpacingSystemProps';
import type { TypographySystemProps } from './TypographySystemProps';

export interface SystemProps
  extends SpacingSystemProps,
    ColorSystemProps,
    TypographySystemProps,
    LayoutSystemProps,
    FlexOrGridItemSystemProps,
    FlexItemSystemProps {}
