import Link from "../Link";

export default function Footer(props: JSX.IntrinsicElements["footer"]) {
  const year = new Date().getFullYear();

  return (
    <footer {...props} className={`text-xs text-center ${props.className}`}>
      <p>
        <Link href="https://github.com/yondako/yondako">GitHub</Link>・
        <Link href="/">利用規約</Link>・
        <Link href="/">プライバシーポリシー</Link>
      </p>
      <p className="mt-2">© {year} yondako</p>
    </footer>
  );
}
