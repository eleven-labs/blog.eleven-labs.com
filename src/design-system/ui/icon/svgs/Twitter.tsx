import * as React from 'react';
import type { SVGProps } from 'react';
const SvgTwitter = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
    <circle cx={32} cy={32} r={32} />
    <path
      fill="#FFF"
      d="M41.116 18.375h4.962l-10.84 12.39 12.753 16.86h-9.986L30.184 37.4l-8.949 10.225H16.27l11.595-13.252-12.234-15.998H25.87l7.07 9.347zm-1.741 26.28h2.749L24.376 21.189h-2.95z"
    />
  </svg>
);
export default SvgTwitter;
