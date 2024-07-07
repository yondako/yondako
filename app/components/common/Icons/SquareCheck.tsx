import type { SVGProps } from "react";
const SvgSquareCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="square-check_svg__icon square-check_svg__icon-tabler square-check_svg__icons-tabler-outline square-check_svg__icon-tabler-square-check"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
export default SvgSquareCheck;
