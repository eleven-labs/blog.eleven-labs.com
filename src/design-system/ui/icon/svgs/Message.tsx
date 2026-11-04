import * as React from 'react';
import type { SVGProps } from 'react';
const SvgMessage = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M9 6h6a3 3 0 0 1 3 3v3.82a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3M5 9a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v3.82a4 4 0 0 1-4 4h-4.741L9 19l-1.405-2.434A4 4 0 0 1 5 12.82z"
      clipRule="evenodd"
    />
    <path stroke="currentColor" strokeLinecap="round" d="M7.914 8.628h7.784m-7.784 2.489h5.855" />
  </svg>
);
export default SvgMessage;
