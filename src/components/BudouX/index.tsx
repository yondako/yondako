import { Parser, jaModel } from "budoux";

type Props = {
  children: string;
};

/**
 * 日本語テキストを適切な位置で改行するBudouXライブラリを使用したコンポーネント。読みやすい改行を自動的に挿入します。
 */
export default function BudouX({ children }: Props) {
  const parser = new Parser(jaModel);

  const result = parser.parse(children).map((word, i) => (
    <span className="inline-block" key={`${i}-${word}`}>
      {word}
    </span>
  ));

  return <>{result}</>;
}
