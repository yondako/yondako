import logoUrl from "../../assets/images/logo_landscape.svg";
import { classNames } from "../../libs/classNames";
import { site } from "../../libs/constants";

export default function Header(props: JSX.IntrinsicElements["div"]) {
  const style =
    "px-8 py-7 text-center bg-gradation bg-no-repeat bg-[left_bottom_-1rem] sm:bg-[left_bottom_-2rem] bg-[length:50%] sm:bg-[length:60%]";

  return (
    <div className={classNames(style, props.className)}>
      <a className="block w-fit m-auto" href="/">
        <img width={200} src={logoUrl} alt={site.name} />
      </a>
    </div>
  );
}
