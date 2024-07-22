import IconBrandAmazon from "@/assets/icons/brand-amazon.svg";
import IconShoppingCart from "@/assets/icons/shopping-cart.svg";
import type { FunctionComponent, SVGProps } from "react";

type Props = {
  isbn10: string;
};

export function ShopLinks({ isbn10 }: Props) {
  return (
    <div className="mt-4 flex items-center space-x-4">
      <ShopLink
        title="Amazon"
        Icon={IconBrandAmazon}
        url={() => {
          const url = new URL(
            `/gp/product/${isbn10}/`,
            "https://www.amazon.co.jp",
          );
          return url.toString();
        }}
      />

      <ShopLink
        title="honto"
        Icon={IconShoppingCart}
        url={() => {
          const url = new URL(
            `/ebook/search_10${isbn10}.html`,
            "https://honto.jp",
          );
          return url.toString();
        }}
      />
    </div>
  );
}

type ShopLinkProps = {
  title: string;
  Icon: FunctionComponent<SVGProps<SVGElement>>;
  url: () => string;
};

function ShopLink({ title, Icon, url }: ShopLinkProps) {
  return (
    <a
      className="flex items-center space-x-2 rounded-full text-sm text-tako"
      href={url()}
      target="_blank"
      rel="noreferrer"
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </a>
  );
}
