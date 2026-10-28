import * as React from 'react';
import type { SVGProps } from 'react';
const SvgCalendar = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M17.6 6.273h-.7V5h-1.4v1.273h-7V5H7.1v1.273h-.7c-.77 0-1.4.572-1.4 1.272v10.182c0 .7.63 1.273 1.4 1.273h11.2c.77 0 1.4-.573 1.4-1.273V7.545c0-.7-.63-1.272-1.4-1.272m0 11.454H6.4V9.455h11.2z"
    />
  </svg>
);
export default SvgCalendar;
