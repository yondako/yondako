import Input from "@/components/Input";
import type { SearchResultProps } from "../SearchResult";
import GenreSelect from "./GenreSelect";

type Props = Partial<Pick<SearchResultProps, "ndc" | "query">>;

export default function SearchForm({ ndc, query }: Props) {
  return (
    <form className="m-0 flex w-full items-center gap-2" action="/search">
      <GenreSelect ndc={ndc} />
      <Input
        className="grow"
        name="q"
        defaultValue={query}
        placeholder="タイトル、著者名で検索"
        autoFocus={!query}
        inputMode="search"
        search
      />
    </form>
  );
}
