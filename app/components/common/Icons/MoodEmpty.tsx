import type { SVGProps } from "react";
const SvgMoodEmpty = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="mood-empty_svg__icon mood-empty_svg__icon-tabler mood-empty_svg__icons-tabler-outline mood-empty_svg__icon-tabler-mood-empty"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M9 10h.01M15 10h.01M9 15h6" />
  </svg>
);
export default SvgMoodEmpty;
