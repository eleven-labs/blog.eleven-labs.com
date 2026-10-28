import * as React from 'react';
import type { SVGProps } from 'react';
const SvgArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 21" {...props}>
    <path stroke="currentColor" d="m1.25 1.27 9.5 9.5-9.5 9.5" />
    <path stroke="currentColor" d="m2.704 6.83 4.046 3.94-4.046 4.062" />
  </svg>
);
export default SvgArrow;
