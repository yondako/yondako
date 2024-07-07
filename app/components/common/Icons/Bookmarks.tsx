import type { SVGProps } from "react";
const SvgBookmarks = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="bookmarks_svg__icon bookmarks_svg__icon-tabler bookmarks_svg__icons-tabler-outline bookmarks_svg__icon-tabler-bookmarks"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M15 10v11l-5-3-5 3V10a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3" />
    <path d="M11 3h5a3 3 0 0 1 3 3v11" />
  </svg>
);
export default SvgBookmarks;
