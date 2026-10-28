import * as React from 'react';
import type { SVGProps } from 'react';
const SvgFacebook = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
    <circle cx={32} cy={32} r={32} fill="#0965FE" />
    <path
      fill="#FFF"
      d="M34.1 47V33.3h4.6l.7-5.3h-5.3v-3.4c0-1.5.4-2.6 2.6-2.6h2.8v-4.8c-.5-.1-2.2-.2-4.1-.2-4.1 0-6.9 2.5-6.9 7v4H24v5.3h4.6V47z"
    />
  </svg>
);
export default SvgFacebook;
