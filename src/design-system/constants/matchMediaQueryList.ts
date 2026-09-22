import { tokenVariables } from '@/design-system/constants/tokenVariables';

export const matchMediaQueryList = {
  mobile: `(max-width: ${Number.parseInt(tokenVariables.breakpoint.sm.value, 10) - 1}px)`,
  aboveMobile: `(min-width:${Number.parseInt(tokenVariables.breakpoint.sm.value, 10)}px)`,
  tablet: `(min-width:${Number.parseInt(tokenVariables.breakpoint.sm.value, 10)}px) and (max-width: ${
    Number.parseInt(tokenVariables.breakpoint.md.value, 10) - 1
  }px)`,
  aboveTablet: `(min-width:${Number.parseInt(tokenVariables.breakpoint.md.value, 10)}px)`,
  desktop: `(min-width:${Number.parseInt(tokenVariables.breakpoint.md.value, 10)}px) and (max-width: ${
    Number.parseInt(tokenVariables.breakpoint.lg.value, 10) - 1
  }px)`,
  aboveDesktop: `(min-width:${Number.parseInt(tokenVariables.breakpoint.lg.value, 10)}px)`,
  large: `(min-width:${Number.parseInt(tokenVariables.breakpoint.lg.value, 10)}px)`,
};
