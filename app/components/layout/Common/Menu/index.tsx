import { FiSearch } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { MdLogout } from "react-icons/md";
import { PiBooks } from "react-icons/pi";
import logoUrl from "../../../../assets/images/logo_portrait.svg";
import { classNames } from "../../../../libs/classNames";
import { site } from "../../../../libs/constants";
import Item from "./Item";

export default function Menu(props: JSX.IntrinsicElements["div"]) {
  const style = "w-full max-w-64 h-full border-r border-line";

  return (
    <div {...props} className={classNames(style, props.className)}>
      <div className="px-8 py-6 bg-gradation bg-left-top bg-no-repeat bg-[length:45%]">
        <a className="block w-fit" href="/">
          <img width={110} src={logoUrl} alt={site.name} />
        </a>
      </div>

      {/* TODO: リンク先を設定する */}
      <div className="mt-2 pr-4 space-y-2">
        <Item title="ホーム" current>
          <GoHome />
        </Item>
        <Item title="ライブラリ">
          <PiBooks />
        </Item>
        <Item title="探す">
          <FiSearch />
        </Item>
        <Item title="ログアウト">
          <MdLogout />
        </Item>
      </div>
    </div>
  );
}
