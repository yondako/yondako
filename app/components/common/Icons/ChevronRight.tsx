import type { SVGProps } from "react";
const SvgChevronRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="chevron-right_svg__icon chevron-right_svg__icon-tabler chevron-right_svg__icons-tabler-outline chevron-right_svg__icon-tabler-chevron-right"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export default SvgChevronRight;
