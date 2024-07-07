import type { SVGProps } from "react";
const SvgShoppingCart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="shopping-cart_svg__icon shopping-cart_svg__icon-tabler shopping-cart_svg__icons-tabler-outline shopping-cart_svg__icon-tabler-shopping-cart"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M4 19a2 2 0 1 0 4 0 2 2 0 1 0-4 0M15 19a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
    <path d="M17 17H6V3H4" />
    <path d="m6 5 14 1-1 7H6" />
  </svg>
);
export default SvgShoppingCart;
