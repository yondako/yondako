import logoUrl from "@/assets/images/logo_portrait.svg";
import { classNames } from "@/libs/classNames";
import { site } from "@/libs/constants";
import { FiSearch } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { PiBarcode, PiBooks } from "react-icons/pi";
import Item from "./Item";

const menuItems = [
  {
    title: "ライブラリ",
    icon: <PiBooks />,
    href: "/library",
  },
  {
    title: "キーワードで探す",
    icon: <FiSearch />,
    href: "/search",
  },
  {
    title: "バーコードで探す",
    icon: <PiBarcode />,
    href: "/search/barcode",
  },
  {
    title: "ログアウト",
    icon: <MdLogout />,
    href: "/",
  },
] as const;

export type MenuProps = {
  current: (typeof menuItems)[number]["title"];
};

export default function Menu({
  current,
  ...props
}: MenuProps & JSX.IntrinsicElements["div"]) {
  const style = "w-full max-w-64 h-full border-r border-line";

  return (
    <div {...props} className={classNames(style, props.className)}>
      <div className="px-8 py-6 bg-gradation bg-left-top bg-no-repeat bg-[length:45%]">
        <a className="block w-fit" href="/">
          <img width={110} src={logoUrl} alt={site.name} />
        </a>
      </div>

      <div className="mt-2 pr-4 space-y-2">
        {menuItems.map((item) => (
          <Item {...item} current={item.title === current} />
        ))}
      </div>
    </div>
  );
}
