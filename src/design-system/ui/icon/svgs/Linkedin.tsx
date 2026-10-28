import * as React from 'react';
import type { SVGProps } from 'react';
const SvgLinkedin = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
    <circle cx={32} cy={32} r={32} fill="#0077B5" />
    <path
      fill="#FFF"
      d="M20.4 44h5.4V26.6h-5.4zm2.7-26c-1.7 0-3.1 1.4-3.1 3.1s1.4 3.1 3.1 3.1 3.1-1.4 3.1-3.1-1.4-3.1-3.1-3.1m16.4 8.2c-2.6 0-4.4 1.4-5.1 2.8h-.1v-2.4h-5.2V44h5.4v-8.6c0-2.3.4-4.5 3.2-4.5s2.8 2.6 2.8 4.6V44H46v-9.5c0-4.7-1-8.3-6.5-8.3"
    />
  </svg>
);
export default SvgLinkedin;
