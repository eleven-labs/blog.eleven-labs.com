import * as React from 'react';
import type { SVGProps } from 'react';
const SvgPerson = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12 12c1.934 0 3.5-1.566 3.5-3.5S13.934 5 12 5a3.5 3.5 0 0 0-3.5 3.5c0 1.934 1.566 3.5 3.5 3.5m0 1.75c-2.336 0-7 1.172-7 3.5V19h14v-1.75c0-2.328-4.664-3.5-7-3.5"
    />
  </svg>
);
export default SvgPerson;
